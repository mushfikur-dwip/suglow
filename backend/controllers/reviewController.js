import db from '../config/database.js';

// Get all reviews with filters (Admin)
export const getReviews = async (req, res) => {
  try {
    const { 
      status, // pending, approved, rejected, all
      product_id,
      rating,
      search, 
      page = 1, 
      limit = 20 
    } = req.query;

    let query = `
      SELECT 
        r.*,
        CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as customer_name,
        u.email as customer_email,
        p.name as product_name,
        p.main_image as product_image
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE 1=1
    `;
    
    const params = [];

    // Filter by status
    if (status && status !== 'all') {
      query += ' AND r.status = ?';
      params.push(status);
    }

    // Filter by product
    if (product_id) {
      query += ' AND r.product_id = ?';
      params.push(product_id);
    }

    // Filter by rating
    if (rating) {
      query += ' AND r.rating = ?';
      params.push(rating);
    }

    // Search by customer name or comment
    if (search) {
      query += ' AND (CONCAT(u.first_name, " ", u.last_name) LIKE ? OR r.comment LIKE ? OR p.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Order by newest first
    query += ' ORDER BY r.created_at DESC';

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [reviews] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM reviews r WHERE 1=1';
    const countParams = [];

    if (status && status !== 'all') {
      countQuery += ' AND r.status = ?';
      countParams.push(status);
    }

    if (product_id) {
      countQuery += ' AND r.product_id = ?';
      countParams.push(product_id);
    }

    if (rating) {
      countQuery += ' AND r.rating = ?';
      countParams.push(rating);
    }

    if (search) {
      countQuery += ` AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = r.user_id AND CONCAT(u.first_name, " ", u.last_name) LIKE ?
      ) OR r.comment LIKE ? OR EXISTS (
        SELECT 1 FROM products p WHERE p.id = r.product_id AND p.name LIKE ?
      )`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reviews,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_reviews,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
    `);

    // Get this month's reviews
    const [[monthStats]] = await db.query(`
      SELECT COUNT(*) as this_month
      FROM reviews
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    res.json({
      success: true,
      data: {
        ...stats[0],
        this_month: monthStats.this_month
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update review status (approve/reject)
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const [[review]] = await db.query(
      'SELECT * FROM reviews WHERE id = ?',
      [id]
    );

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    await db.query(
      'UPDATE reviews SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: `Review ${status} successfully`
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const [[review]] = await db.query(
      'SELECT * FROM reviews WHERE id = ?',
      [id]
    );

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    await db.query('DELETE FROM reviews WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk update review status
export const bulkUpdateReviewStatus = async (req, res) => {
  try {
    const { review_ids, status } = req.body;

    if (!Array.isArray(review_ids) || review_ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Review IDs array is required' 
      });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const placeholders = review_ids.map(() => '?').join(',');
    await db.query(
      `UPDATE reviews SET status = ? WHERE id IN (${placeholders})`,
      [status, ...review_ids]
    );

    res.json({
      success: true,
      message: `${review_ids.length} reviews ${status} successfully`
    });
  } catch (error) {
    console.error('Bulk update review status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
