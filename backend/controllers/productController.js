import db from '../config/database.js';

// Get all products with filters
export const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      search, 
      featured, 
      trending,
      bestSeller,
      newArrival,
      sort = 'created_at',
      order = 'DESC',
      page = 1,
      limit = 12,
      status // Added status filter for admin panel
    } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Apply status filter - if not provided, show only active (for customer-facing pages)
    // If status is provided, filter by that status (for admin panel)
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    } else if (!req.path.includes('admin')) {
      // Only filter by active status for customer-facing routes
      query += ' AND p.status = "active"';
    }

    // Apply filters
    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    if (brand) {
      query += ' AND p.brand = ?';
      params.push(brand);
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (featured === 'true') {
      query += ' AND p.featured = TRUE';
    }
    if (trending === 'true') {
      query += ' AND p.trending = TRUE';
    }
    if (bestSeller === 'true') {
      query += ' AND p.best_seller = TRUE';
    }
    if (newArrival === 'true') {
      query += ' AND p.new_arrival = TRUE';
    }

    // Add sorting
    const validSortFields = ['price', 'name', 'created_at'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY p.${sortField} ${sortOrder}`;

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    // Apply same status filter to count query
    if (status) {
      countQuery += ' AND p.status = ?';
    } else if (!req.path.includes('admin')) {
      countQuery += ' AND p.status = "active"';
    }
    
    const countParams = params.slice(0, -2); // Remove limit and offset
    
    const [products] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);
    const totalProducts = countResult[0].total;

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalProducts,
        totalPages: Math.ceil(totalProducts / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products' 
    });
  }
};

// Get single product by ID (Admin only - for editing)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product' 
    });
  }
};

// Get single product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.status = 'active'`,
      [slug]
    );

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Get product reviews
    const [reviews] = await db.query(
      `SELECT r.*, u.first_name, u.last_name 
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? AND r.status = 'approved'
       ORDER BY r.created_at DESC`,
      [products[0].id]
    );

    res.json({
      success: true,
      data: {
        ...products[0],
        reviews
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product' 
    });
  }
};

// Create new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    console.log('Create product - File received:', req.file);
    console.log('Create product - Body:', req.body);
    
    const {
      sku, name, slug, description, short_description, category_id,
      brand, price, sale_price, stock_quantity, main_image_url, featured,
      trending, best_seller, new_arrival, status
    } = req.body;

    // Use uploaded file path or provided URL
    let mainImage = main_image_url || null;
    if (req.file) {
      mainImage = `/images/${req.file.filename}`;
      console.log('Image path saved:', mainImage);
    }

    const [result] = await db.query(
      `INSERT INTO products 
       (sku, name, slug, description, short_description, category_id, brand, 
        price, sale_price, stock_quantity, main_image, featured, trending, 
        best_seller, new_arrival, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sku, name, slug, description || '', short_description || '', category_id, brand || '',
       price, sale_price || null, stock_quantity || 0, mainImage, featured === '1' || featured === true ? 1 : 0,
       trending === '1' || trending === true ? 1 : 0, best_seller === '1' || best_seller === true ? 1 : 0, 
       new_arrival === '1' || new_arrival === true ? 1 : 0, status || 'active']
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      productId: result.insertId,
      imagePath: mainImage
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sku, name, slug, description, short_description, category_id, brand,
      price, sale_price, stock_quantity, main_image_url, 
      featured, trending, best_seller, new_arrival, status
    } = req.body;

    // Use uploaded file path or provided URL
    let imageUrl = main_image_url;
    if (req.file) {
      imageUrl = `/images/${req.file.filename}`;
    }

    await db.query(
      `UPDATE products SET 
       sku = ?, name = ?, slug = ?, description = ?, short_description = ?, 
       category_id = ?, brand = ?, price = ?, sale_price = ?, stock_quantity = ?,
       main_image = ?, featured = ?, trending = ?, best_seller = ?,
       new_arrival = ?, status = ?
       WHERE id = ?`,
      [sku, name, slug, description || '', short_description || '', category_id, brand || '', 
       price, sale_price || null, stock_quantity || 0, imageUrl, 
       featured === '1' || featured === true ? 1 : 0, trending === '1' || trending === true ? 1 : 0, 
       best_seller === '1' || best_seller === true ? 1 : 0, new_arrival === '1' || new_arrival === true ? 1 : 0, 
       status || 'active', id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product is referenced in orders
    const [orderItems] = await db.query(
      'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
      [id]
    );

    if (orderItems[0].count > 0) {
      // Soft delete - mark as inactive instead of deleting
      await db.query(
        'UPDATE products SET status = ? WHERE id = ?',
        ['inactive', id]
      );

      return res.json({
        success: true,
        message: 'Product deactivated successfully (product is linked to existing orders)',
        softDelete: true
      });
    }

    // If not referenced, hard delete
    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product' 
    });
  }
};
