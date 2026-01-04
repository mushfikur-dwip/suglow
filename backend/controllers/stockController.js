import db from '../config/database.js';

// Get all stock with filters
export const getStock = async (req, res) => {
  try {
    const { 
      status, // low_stock, out_of_stock, in_stock, all
      search, 
      category, 
      page = 1, 
      limit = 50 
    } = req.query;

    let query = `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.stock_quantity,
        p.low_stock_threshold,
        p.price,
        p.sale_price,
        p.status,
        c.name as category_name,
        CASE
          WHEN p.stock_quantity = 0 THEN 'out_of_stock'
          WHEN p.stock_quantity <= p.low_stock_threshold THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];

    // Filter by stock status
    if (status && status !== 'all') {
      if (status === 'out_of_stock') {
        query += ' AND p.stock_quantity = 0';
      } else if (status === 'low_stock') {
        query += ' AND p.stock_quantity > 0 AND p.stock_quantity <= p.low_stock_threshold';
      } else if (status === 'in_stock') {
        query += ' AND p.stock_quantity > p.low_stock_threshold';
      }
    }

    // Search by name or SKU
    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Filter by category
    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    // Order by stock status (critical first)
    query += ' ORDER BY stock_status DESC, p.stock_quantity ASC';

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
    const countParams = [];

    if (status && status !== 'all') {
      if (status === 'out_of_stock') {
        countQuery += ' AND p.stock_quantity = 0';
      } else if (status === 'low_stock') {
        countQuery += ' AND p.stock_quantity > 0 AND p.stock_quantity <= p.low_stock_threshold';
      } else if (status === 'in_stock') {
        countQuery += ' AND p.stock_quantity > p.low_stock_threshold';
      }
    }

    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      countQuery += ' AND p.category_id = ?';
      countParams.push(category);
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get stock statistics
export const getStockStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock,
        SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= low_stock_threshold THEN 1 ELSE 0 END) as low_stock,
        SUM(CASE WHEN stock_quantity > low_stock_threshold THEN 1 ELSE 0 END) as in_stock,
        SUM(stock_quantity * COALESCE(cost_price, price)) as total_stock_value
      FROM products
      WHERE status != 'discontinued'
    `);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get stock stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update stock quantity
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity, low_stock_threshold, notes } = req.body;

    if (stock_quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Stock quantity is required' 
      });
    }

    // Get current product
    const [[product]] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Update stock
    const updateFields = ['stock_quantity = ?'];
    const params = [stock_quantity];

    if (low_stock_threshold !== undefined) {
      updateFields.push('low_stock_threshold = ?');
      params.push(low_stock_threshold);
    }

    // Auto-update status based on stock
    if (stock_quantity === 0) {
      updateFields.push("status = 'out_of_stock'");
    } else if (product.status === 'out_of_stock') {
      updateFields.push("status = 'active'");
    }

    params.push(id);

    await db.query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    res.json({
      success: true,
      message: 'Stock updated successfully'
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk stock update
export const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of {id, stock_quantity}

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Updates array is required' 
      });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      for (const update of updates) {
        const { id, stock_quantity } = update;
        
        if (!id || stock_quantity === undefined) continue;

        const [[product]] = await connection.query(
          'SELECT status FROM products WHERE id = ?',
          [id]
        );

        if (!product) continue;

        let status = product.status;
        if (stock_quantity === 0 && status !== 'discontinued') {
          status = 'out_of_stock';
        } else if (stock_quantity > 0 && status === 'out_of_stock') {
          status = 'active';
        }

        await connection.query(
          'UPDATE products SET stock_quantity = ?, status = ? WHERE id = ?',
          [stock_quantity, status, id]
        );
      }

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: 'Bulk stock update completed'
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Bulk update stock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
