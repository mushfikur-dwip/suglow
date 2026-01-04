import db from '../config/database.js';

// Get all returns and refunds (Admin only)
export const getAllReturns = async (req, res) => {
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
      WHERE (o.status = 'returned' OR o.payment_status = 'refunded')
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' AND o.payment_status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (o.order_number LIKE ? OR u.email LIKE ? OR CONCAT(u.first_name, " ", u.last_name) LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY o.id ORDER BY o.updated_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [returns] = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(DISTINCT o.id) as total FROM orders o 
                      LEFT JOIN users u ON o.user_id = u.id 
                      WHERE (o.status = 'returned' OR o.payment_status = 'refunded')`;
    const countParams = [];

    if (status && status !== 'all') {
      countQuery += ' AND o.payment_status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (o.order_number LIKE ? OR u.email LIKE ? OR CONCAT(u.first_name, " ", u.last_name) LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: returns,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all returns error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch returns' 
    });
  }
};

// Get return/refund statistics
export const getReturnStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_returns,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_refunds,
        SUM(CASE WHEN payment_status = 'refunded' THEN 1 ELSE 0 END) as completed_refunds,
        SUM(CASE WHEN payment_status = 'refunded' THEN total_amount ELSE 0 END) as total_refunded_amount
      FROM orders
      WHERE status = 'returned' OR payment_status = 'refunded'
    `);

    // Get this month's returns
    const [[thisMonthStats]] = await db.query(`
      SELECT COUNT(*) as this_month_returns
      FROM orders
      WHERE (status = 'returned' OR payment_status = 'refunded')
      AND MONTH(updated_at) = MONTH(CURRENT_DATE())
      AND YEAR(updated_at) = YEAR(CURRENT_DATE())
    `);

    res.json({
      success: true,
      data: {
        ...stats[0],
        this_month_returns: thisMonthStats.this_month_returns || 0
      }
    });
  } catch (error) {
    console.error('Get return stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch return statistics' 
    });
  }
};

// Process refund
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;

    // Update order payment status to refunded
    await db.query(
      'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      ['refunded', id]
    );

    res.json({
      success: true,
      message: 'Refund processed successfully'
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process refund' 
    });
  }
};

// Cancel refund request
export const cancelRefund = async (req, res) => {
  try {
    const { id } = req.params;

    // Update order to cancel the return
    await db.query(
      'UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?',
      ['delivered', 'paid', id]
    );

    res.json({
      success: true,
      message: 'Refund request cancelled'
    });
  } catch (error) {
    console.error('Cancel refund error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel refund' 
    });
  }
};
