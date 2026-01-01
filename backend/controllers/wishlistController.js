import db from '../config/database.js';

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    
    const [wishlistItems] = await db.query(
      `SELECT w.*, p.name, p.slug, p.price, p.original_price, p.image, p.in_stock 
       FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ? 
       ORDER BY w.created_at DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { product_id } = req.body;
    
    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    
    // Check if product exists
    const [product] = await db.query('SELECT id FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Check if already in wishlist
    const [existing] = await db.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }
    
    // Add to wishlist
    await db.query(
      'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
      [userId, product_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM wishlists WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
    }
    
    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Check if product is in wishlist
export const checkWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { product_id } = req.params;
    
    const [existing] = await db.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );
    
    res.json({
      success: true,
      inWishlist: existing.length > 0
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
