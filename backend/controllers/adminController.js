import db from '../config/database.js';
import bcrypt from 'bcryptjs';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Total Revenue
    const [revenueResult] = await db.query(
      `SELECT SUM(total_amount) as total_revenue 
       FROM orders WHERE status != 'cancelled'`
    );

    // Total Orders
    const [ordersResult] = await db.query(
      'SELECT COUNT(*) as total_orders FROM orders'
    );

    // Total Customers
    const [customersResult] = await db.query(
      "SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'"
    );

    // Total Products
    const [productsResult] = await db.query(
      'SELECT COUNT(*) as total_products FROM products WHERE status = "active"'
    );

    // Recent Orders
    const [recentOrders] = await db.query(
      `SELECT o.*, u.email, u.first_name, u.last_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    // Order Status Count
    const [orderStatusCount] = await db.query(
      `SELECT status, COUNT(*) as count
       FROM orders
       GROUP BY status`
    );

    // Low Stock Products
    const [lowStockProducts] = await db.query(
      `SELECT * FROM products
       WHERE stock_quantity <= low_stock_threshold
       AND status = 'active'
       ORDER BY stock_quantity ASC
       LIMIT 10`
    );

    // Sales by Day (Last 7 days)
    const [salesByDay] = await db.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
       FROM orders
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       AND status != 'cancelled'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue: revenueResult[0].total_revenue || 0,
          totalOrders: ordersResult[0].total_orders,
          totalCustomers: customersResult[0].total_customers,
          totalProducts: productsResult[0].total_products
        },
        recentOrders,
        orderStatusCount,
        lowStockProducts,
        salesByDay
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard statistics' 
    });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, 
        u.reward_points, u.status, u.created_at,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
       WHERE u.role = 'customer'`;
    
    const params = [];

    if (search) {
      query += ` AND (u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status && status !== 'all') {
      query += ` AND u.status = ?`;
      params.push(status);
    }

    query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [customers] = await db.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM users WHERE role = 'customer'";
    const countParams = [];

    if (search) {
      countQuery += ` AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR phone LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status && status !== 'all') {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customers' 
    });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_customers,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_customers,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_customers,
        SUM(reward_points) as total_reward_points
      FROM users
      WHERE role = 'customer'
    `);

    // Get this month's new customers
    const [[thisMonthStats]] = await db.query(`
      SELECT COUNT(*) as new_this_month
      FROM users
      WHERE role = 'customer'
      AND MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    res.json({
      success: true,
      data: {
        ...stats[0],
        new_this_month: thisMonthStats.new_this_month || 0
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customer statistics' 
    });
  }
};

// Get single customer details
export const getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [[customer]] = await db.query(
      `SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, 
        u.reward_points, u.status, u.created_at,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
       WHERE u.role = 'customer' AND u.id = ?
       GROUP BY u.id`,
      [id]
    );

    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    // Get customer's recent orders
    const [orders] = await db.query(
      `SELECT id, order_number, total_amount, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [id]
    );

    // Get customer's addresses
    const [addresses] = await db.query(
      `SELECT *
       FROM addresses
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...customer,
        recent_orders: orders,
        addresses
      }
    });
  } catch (error) {
    console.error('Get customer details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customer details' 
    });
  }
};

// Create new customer
export const createCustomer = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      password,
      status = 'active'
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }

    // Check if email already exists
    const [[existingUser]] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new customer
    const [result] = await db.query(
      `INSERT INTO users (first_name, last_name, email, phone, password, role, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'customer', ?, NOW())`,
      [first_name, last_name, email, phone || null, hashedPassword, status]
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create customer' 
    });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      password,
      status
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Check if email exists for another user
    const [[existingUser]] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Build update query
    let updateFields = ['first_name = ?', 'last_name = ?', 'email = ?', 'phone = ?'];
    let updateParams = [first_name, last_name, email, phone || null];

    if (status && ['active', 'inactive', 'blocked'].includes(status)) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }

    // If password is provided, hash and update it
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateParams.push(hashedPassword);
    }

    updateParams.push(id);

    await db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ? AND role = "customer"`,
      updateParams
    );

    res.json({
      success: true,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update customer' 
    });
  }
};

// Update customer status
export const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await db.query(
      'UPDATE users SET status = ? WHERE id = ? AND role = "customer"',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Customer status updated successfully'
    });
  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update customer status' 
    });
  }
};

// Get product reviews
export const getReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT r.*, p.name as product_name, u.email as user_email,
             u.first_name, u.last_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      LEFT JOIN users u ON r.user_id = u.id
    `;

    const params = [];

    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [reviews] = await db.query(query, params);

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews' 
    });
  }
};

// Update review status
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);

    res.json({
      success: true,
      message: 'Review status updated'
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update review status' 
    });
  }
};
