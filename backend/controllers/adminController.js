import db from '../config/database.js';

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
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [customers] = await db.query(
      `SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, 
        u.reward_points, u.status, u.created_at,
        COUNT(DISTINCT o.id) as order_count,
        SUM(o.total_amount) as total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
       WHERE u.role = 'customer'
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM users WHERE role = 'customer'"
    );

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total
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
