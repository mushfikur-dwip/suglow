import db from '../config/database.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.query.sessionId;

    let query = `
      SELECT c.*, p.name, p.slug, p.price, p.sale_price, p.main_image, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE 
    `;
    
    const params = userId ? [userId] : [sessionId];
    query += userId ? 'c.user_id = ?' : 'c.session_id = ?';

    const [cartItems] = await db.query(query, params);

    const total = cartItems.reduce((sum, item) => {
      const price = item.sale_price || item.price;
      return sum + (price * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: cartItems,
      total
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch cart' 
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1, sessionId } = req.body;
    const userId = req.user?.id;

    if (!product_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    // Check if product exists and has stock
    const [products] = await db.query(
      'SELECT stock_quantity FROM products WHERE id = ? AND status = "active"',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (products[0].stock_quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock' 
      });
    }

    // Check if item already in cart
    const checkQuery = userId 
      ? 'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?'
      : 'SELECT id, quantity FROM cart WHERE session_id = ? AND product_id = ?';
    const checkParams = userId ? [userId, product_id] : [sessionId, product_id];
    
    const [existing] = await db.query(checkQuery, checkParams);

    if (existing.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      // Add new item
      await db.query(
        'INSERT INTO cart (user_id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)',
        [userId || null, sessionId || null, product_id, quantity]
      );
    }

    res.json({
      success: true,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item to cart' 
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    await db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id]);

    res.json({
      success: true,
      message: 'Cart updated'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update cart' 
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM cart WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove item' 
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.query.sessionId;

    const query = userId 
      ? 'DELETE FROM cart WHERE user_id = ?'
      : 'DELETE FROM cart WHERE session_id = ?';
    const params = userId ? [userId] : [sessionId];

    await db.query(query, params);

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear cart' 
    });
  }
};
