import db from '../config/database.js';

// Create new order
export const createOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      guestEmail
    } = req.body;

    const userId = req.user?.id || null;

    // Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT price, sale_price, stock_quantity FROM products WHERE id = ?',
        [item.productId]
      );
      
      if (products.length === 0 || products[0].stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          message: 'Product unavailable or insufficient stock' 
        });
      }

      const price = products[0].sale_price || products[0].price;
      subtotal += price * item.quantity;
    }

    // Apply coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const [coupons] = await connection.query(
        `SELECT * FROM coupons 
         WHERE code = ? AND status = 'active' 
         AND (valid_from IS NULL OR valid_from <= NOW())
         AND (valid_until IS NULL OR valid_until >= NOW())`,
        [couponCode]
      );

      if (coupons.length > 0) {
        const coupon = coupons[0];
        if (subtotal >= coupon.min_purchase_amount) {
          if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount) {
              discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
            }
          } else {
            discountAmount = coupon.discount_value;
          }
        }
      }
    }

    const shippingCost = subtotal >= 2000 ? 0 : 100; // Free shipping over ৳2000
    const totalAmount = subtotal - discountAmount + shippingCost;

    // Create shipping address
    const [shippingResult] = await connection.query(
      `INSERT INTO addresses (user_id, type, first_name, last_name, phone, 
       address_line1, address_line2, city, state, postal_code, country)
       VALUES (?, 'shipping', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, shippingAddress.firstName, shippingAddress.lastName, 
       shippingAddress.phone, shippingAddress.addressLine1, 
       shippingAddress.addressLine2, shippingAddress.city, 
       shippingAddress.state, shippingAddress.postalCode, 
       shippingAddress.country || 'Bangladesh']
    );

    // Create billing address
    const [billingResult] = await connection.query(
      `INSERT INTO addresses (user_id, type, first_name, last_name, phone,
       address_line1, address_line2, city, state, postal_code, country)
       VALUES (?, 'billing', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, billingAddress.firstName, billingAddress.lastName,
       billingAddress.phone, billingAddress.addressLine1,
       billingAddress.addressLine2, billingAddress.city,
       billingAddress.state, billingAddress.postalCode,
       billingAddress.country || 'Bangladesh']
    );

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (order_number, user_id, guest_email, payment_method, subtotal, 
        discount_amount, shipping_cost, total_amount, coupon_code,
        shipping_address_id, billing_address_id, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [orderNumber, userId, guestEmail, paymentMethod, subtotal,
       discountAmount, shippingCost, totalAmount, couponCode,
       shippingResult.insertId, billingResult.insertId]
    );

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT name, sku, price, sale_price FROM products WHERE id = ?',
        [item.productId]
      );

      const product = products[0];
      const unitPrice = product.sale_price || product.price;
      const totalPrice = unitPrice * item.quantity;

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, 
         product_sku, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, product.name, product.sku,
         item.quantity, unitPrice, totalPrice]
      );

      // Update stock
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // Clear user's cart
    if (userId) {
      await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    }

    // Record coupon usage
    if (couponCode && userId) {
      await connection.query(
        'INSERT INTO coupon_usage (coupon_id, user_id, order_id) SELECT id, ?, ? FROM coupons WHERE code = ?',
        [userId, orderId, couponCode]
      );
      await connection.query(
        'UPDATE coupons SET used_count = used_count + 1 WHERE code = ?',
        [couponCode]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId,
      orderNumber
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order' 
    });
  } finally {
    connection.release();
  }
};

// Get user's orders
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT o.*, 
       sa.address_line1 as shipping_address,
       sa.city as shipping_city,
       COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders' 
    });
  }
};

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT o.*, 
       sa.first_name as shipping_first_name, sa.last_name as shipping_last_name,
       sa.email as shipping_email, sa.phone as shipping_phone, 
       sa.address_line1 as shipping_address_line1,
       sa.address_line2 as shipping_address_line2, sa.city as shipping_city,
       sa.state as shipping_state, sa.postal_code as shipping_postal_code,
       sa.country as shipping_country,
       ba.first_name as billing_first_name, ba.last_name as billing_last_name,
       ba.email as billing_email, ba.phone as billing_phone, 
       ba.address_line1 as billing_address_line1,
       ba.address_line2 as billing_address_line2, ba.city as billing_city,
       ba.state as billing_state, ba.postal_code as billing_postal_code,
       ba.country as billing_country
       FROM orders o
       LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
       LEFT JOIN addresses ba ON o.billing_address_id = ba.id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.main_image, p.slug
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    const order = orders[0];
    
    // Structure the shipping and billing addresses properly
    const formattedOrder = {
      ...order,
      shipping_address: {
        first_name: order.shipping_first_name,
        last_name: order.shipping_last_name,
        email: order.shipping_email,
        phone: order.shipping_phone,
        address_line1: order.shipping_address_line1,
        address_line2: order.shipping_address_line2,
        city: order.shipping_city,
        state: order.shipping_state,
        postal_code: order.shipping_postal_code,
        country: order.shipping_country,
      },
      billing_address: {
        first_name: order.billing_first_name,
        last_name: order.billing_last_name,
        email: order.billing_email,
        phone: order.billing_phone,
        address_line1: order.billing_address_line1,
        address_line2: order.billing_address_line2,
        city: order.billing_city,
        state: order.billing_state,
        postal_code: order.billing_postal_code,
        country: order.billing_country,
      },
      items
    };

    // Remove the flat address fields
    delete formattedOrder.shipping_first_name;
    delete formattedOrder.shipping_last_name;
    delete formattedOrder.shipping_email;
    delete formattedOrder.shipping_phone;
    delete formattedOrder.shipping_address_line1;
    delete formattedOrder.shipping_address_line2;
    delete formattedOrder.shipping_city;
    delete formattedOrder.shipping_state;
    delete formattedOrder.shipping_postal_code;
    delete formattedOrder.shipping_country;
    delete formattedOrder.billing_first_name;
    delete formattedOrder.billing_last_name;
    delete formattedOrder.billing_email;
    delete formattedOrder.billing_phone;
    delete formattedOrder.billing_address_line1;
    delete formattedOrder.billing_address_line2;
    delete formattedOrder.billing_city;
    delete formattedOrder.billing_state;
    delete formattedOrder.billing_postal_code;
    delete formattedOrder.billing_country;

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order details' 
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    let updateQuery = 'UPDATE orders SET status = ?';
    const params = [status];

    if (trackingNumber) {
      updateQuery += ', tracking_number = ?';
      params.push(trackingNumber);
    }

    if (status === 'shipped') {
      updateQuery += ', shipped_at = NOW()';
    } else if (status === 'delivered') {
      updateQuery += ', delivered_at = NOW()';
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await db.query(updateQuery, params);

    res.json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update order status' 
    });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT o.*, 
      CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as customer_name,
      u.email as customer_email,
      u.phone as customer_phone,
      COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (o.order_number LIKE ? OR u.email LIKE ? OR CONCAT(u.first_name, " ", u.last_name) LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [orders] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders o WHERE 1=1';
    const countParams = [];

    if (status && status !== 'all') {
      countQuery += ' AND o.status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ` AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = o.user_id AND 
        (o.order_number LIKE ? OR u.email LIKE ? OR CONCAT(u.first_name, " ", u.last_name) LIKE ?)
      )`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders' 
    });
  }
};

// Get admin order details
export const getAdminOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      `SELECT o.*, 
       CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as customer_name,
       u.email as customer_email,
       u.phone as customer_phone,
       sa.first_name as shipping_first_name, sa.last_name as shipping_last_name,
       sa.email as shipping_email, sa.phone as shipping_phone, 
       sa.address_line1 as shipping_address_line1,
       sa.address_line2 as shipping_address_line2, sa.city as shipping_city,
       sa.state as shipping_state, sa.postal_code as shipping_postal_code,
       sa.country as shipping_country
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.main_image, p.slug, p.name as product_name
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    const order = orders[0];

    res.json({
      success: true,
      data: {
        ...order,
        shipping_address: {
          first_name: order.shipping_first_name,
          last_name: order.shipping_last_name,
          email: order.shipping_email,
          phone: order.shipping_phone,
          address_line1: order.shipping_address_line1,
          address_line2: order.shipping_address_line2,
          city: order.shipping_city,
          state: order.shipping_state,
          postal_code: order.shipping_postal_code,
          country: order.shipping_country,
        },
        items
      }
    });
  } catch (error) {
    console.error('Get admin order details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order details' 
    });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
        SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(total_amount) as total_revenue
      FROM orders
    `);

    // Get today's orders
    const [[todayStats]] = await db.query(`
      SELECT COUNT(*) as today_orders, SUM(total_amount) as today_revenue
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);

    res.json({
      success: true,
      data: {
        ...stats[0],
        today_orders: todayStats.today_orders || 0,
        today_revenue: todayStats.today_revenue || 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order statistics' 
    });
  }
};
