import db from '../config/database.js';

// Get all purchase orders with filters
export const getPurchaseOrders = async (req, res) => {
  try {
    const { 
      status, 
      supplier_id,
      search,
      from_date,
      to_date,
      page = 1, 
      limit = 10 
    } = req.query;

    let query = `
      SELECT 
        po.*,
        s.name as supplier_name,
        s.company_name as supplier_company,
        COUNT(poi.id) as total_items,
        SUM(poi.quantity) as total_quantity
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND po.status = ?';
      params.push(status);
    }

    if (supplier_id) {
      query += ' AND po.supplier_id = ?';
      params.push(supplier_id);
    }

    if (search) {
      query += ' AND (po.order_number LIKE ? OR s.name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (from_date) {
      query += ' AND po.order_date >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND po.order_date <= ?';
      params.push(to_date);
    }

    query += ' GROUP BY po.id ORDER BY po.created_at DESC';

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [orders] = await db.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT po.id) as total 
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      WHERE 1=1
    `;
    const countParams = [];

    if (status) {
      countQuery += ' AND po.status = ?';
      countParams.push(status);
    }

    if (supplier_id) {
      countQuery += ' AND po.supplier_id = ?';
      countParams.push(supplier_id);
    }

    if (search) {
      countQuery += ' AND (po.order_number LIKE ? OR s.name LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch purchase orders' 
    });
  }
};

// Get single purchase order by ID
export const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      `SELECT 
        po.*,
        s.name as supplier_name,
        s.company_name as supplier_company,
        s.email as supplier_email,
        s.phone as supplier_phone,
        s.address as supplier_address
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      WHERE po.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Purchase order not found' 
      });
    }

    // Get purchase order items with product details
    const [items] = await db.query(
      `SELECT 
        poi.*,
        p.name as product_name,
        p.sku as product_sku,
        p.main_image as product_image
      FROM purchase_order_items poi
      LEFT JOIN products p ON poi.product_id = p.id
      WHERE poi.purchase_order_id = ?`,
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
    console.error('Get purchase order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch purchase order' 
    });
  }
};

// Create new purchase order
export const createPurchaseOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      supplier_id,
      order_date,
      expected_delivery_date,
      items,
      payment_method,
      notes
    } = req.body;

    // Generate order number
    const [lastOrder] = await connection.query(
      'SELECT order_number FROM purchase_orders ORDER BY id DESC LIMIT 1'
    );
    
    let orderNumber = 'PO-001';
    if (lastOrder.length > 0) {
      const lastNumber = parseInt(lastOrder[0].order_number.split('-')[1]);
      orderNumber = `PO-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Calculate total amount
    const total_amount = items.reduce((sum, item) => 
      sum + (item.quantity * item.unit_price), 0
    );

    // Insert purchase order
    const [result] = await connection.query(
      `INSERT INTO purchase_orders 
      (order_number, supplier_id, order_date, expected_delivery_date, 
       total_amount, payment_method, notes, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, supplier_id, order_date, expected_delivery_date, 
       total_amount, payment_method, notes, req.user.id]
    );

    const purchaseOrderId = result.insertId;

    // Insert purchase order items
    for (const item of items) {
      const totalPrice = item.quantity * item.unit_price;
      await connection.query(
        `INSERT INTO purchase_order_items 
        (purchase_order_id, product_id, quantity, unit_price, total_price) 
        VALUES (?, ?, ?, ?, ?)`,
        [purchaseOrderId, item.product_id, item.quantity, item.unit_price, totalPrice]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: { id: purchaseOrderId, order_number: orderNumber }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create purchase order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create purchase order' 
    });
  } finally {
    connection.release();
  }
};

// Update purchase order status
export const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, received_date } = req.body;

    const updateData = { status };
    const params = [status];

    if (status === 'received' && received_date) {
      updateData.received_date = received_date;
      params.push(received_date);
      params.push(id);
      
      await db.query(
        'UPDATE purchase_orders SET status = ?, received_date = ? WHERE id = ?',
        params
      );

      // Update product stock when received
      const [items] = await db.query(
        'SELECT product_id, quantity FROM purchase_order_items WHERE purchase_order_id = ?',
        [id]
      );

      for (const item of items) {
        await db.query(
          'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    } else {
      await db.query(
        'UPDATE purchase_orders SET status = ? WHERE id = ?',
        [status, id]
      );
    }

    res.json({
      success: true,
      message: 'Purchase order status updated successfully'
    });
  } catch (error) {
    console.error('Update purchase order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update purchase order status' 
    });
  }
};

// Delete purchase order
export const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order can be deleted (only pending orders)
    const [orders] = await db.query(
      'SELECT status FROM purchase_orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Purchase order not found' 
      });
    }

    if (orders[0].status === 'received') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete received purchase orders' 
      });
    }

    await db.query('DELETE FROM purchase_orders WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
  } catch (error) {
    console.error('Delete purchase order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete purchase order' 
    });
  }
};

// Get purchase statistics
export const getPurchaseStats = async (req, res) => {
  try {
    // Total purchases
    const [totalPurchases] = await db.query(
      'SELECT SUM(total_amount) as total FROM purchase_orders WHERE status != "cancelled"'
    );

    // Pending orders count
    const [pendingOrders] = await db.query(
      'SELECT COUNT(*) as count FROM purchase_orders WHERE status = "pending"'
    );

    // Items received
    const [itemsReceived] = await db.query(
      'SELECT SUM(poi.received_quantity) as total FROM purchase_order_items poi JOIN purchase_orders po ON poi.purchase_order_id = po.id WHERE po.status = "received"'
    );

    // Active suppliers
    const [activeSuppliers] = await db.query(
      'SELECT COUNT(*) as count FROM suppliers WHERE status = "active"'
    );

    // Recent purchases (last 30 days)
    const [recentPurchases] = await db.query(
      `SELECT 
        DATE(order_date) as date,
        SUM(total_amount) as amount
      FROM purchase_orders
      WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(order_date)
      ORDER BY date ASC`
    );

    // Status breakdown
    const [statusBreakdown] = await db.query(
      `SELECT status, COUNT(*) as count 
      FROM purchase_orders 
      GROUP BY status`
    );

    res.json({
      success: true,
      data: {
        total_purchases: totalPurchases[0].total || 0,
        pending_orders: pendingOrders[0].count || 0,
        items_received: itemsReceived[0].total || 0,
        active_suppliers: activeSuppliers[0].count || 0,
        recent_purchases: recentPurchases,
        status_breakdown: statusBreakdown
      }
    });
  } catch (error) {
    console.error('Get purchase stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch purchase statistics' 
    });
  }
};

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM suppliers';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY name ASC';

    const [suppliers] = await db.query(query, params);

    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch suppliers' 
    });
  }
};

// Create new supplier
export const createSupplier = async (req, res) => {
  try {
    const {
      name,
      company_name,
      email,
      phone,
      address,
      city,
      country,
      tax_id,
      payment_terms
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Supplier name is required'
      });
    }

    const [result] = await db.query(
      `INSERT INTO suppliers 
      (name, company_name, email, phone, address, city, country, tax_id, payment_terms, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [name, company_name, email, phone, address, city, country, tax_id, payment_terms]
    );

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create supplier'
    });
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      company_name,
      email,
      phone,
      address,
      city,
      country,
      tax_id,
      payment_terms,
      status
    } = req.body;

    await db.query(
      `UPDATE suppliers SET 
       name = ?, company_name = ?, email = ?, phone = ?, 
       address = ?, city = ?, country = ?, tax_id = ?, 
       payment_terms = ?, status = ?
       WHERE id = ?`,
      [name, company_name, email, phone, address, city, country, 
       tax_id, payment_terms, status, id]
    );

    res.json({
      success: true,
      message: 'Supplier updated successfully'
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update supplier'
    });
  }
};
