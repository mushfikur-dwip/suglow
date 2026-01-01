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
       sa.phone as shipping_phone, sa.address_line1 as shipping_address_line1,
       sa.address_line2 as shipping_address_line2, sa.city as shipping_city,
       sa.state as shipping_state, sa.postal_code as shipping_postal_code,
       ba.first_name as billing_first_name, ba.last_name as billing_last_name,
       ba.phone as billing_phone, ba.address_line1 as billing_address_line1,
       ba.address_line2 as billing_address_line2, ba.city as billing_city,
       ba.state as billing_state, ba.postal_code as billing_postal_code
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

    res.json({
      success: true,
      data: {
        ...orders[0],
        items
      }
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
    const { status, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT o.*, 
      u.email as customer_email,
      u.first_name as customer_first_name,
      COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [orders] = await db.query(query, params);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders' 
    });
  }
};
