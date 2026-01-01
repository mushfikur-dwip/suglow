import db from '../config/database.js';

// Get user rewards
export const getRewards = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get total points
    const [points] = await db.query(
      'SELECT COALESCE(SUM(points), 0) as total_points FROM rewards WHERE user_id = ?',
      [userId]
    );
    
    // Get reward history
    const [history] = await db.query(
      `SELECT * FROM rewards 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        totalPoints: points[0].total_points || 0,
        history: history
      }
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add reward points (admin or system)
export const addRewardPoints = async (req, res) => {
  try {
    const { user_id, points, description, type } = req.body;
    
    if (!user_id || !points || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID, points, and description are required' 
      });
    }
    
    await db.query(
      'INSERT INTO rewards (user_id, points, description, type) VALUES (?, ?, ?, ?)',
      [user_id, points, description, type || 'purchase']
    );
    
    res.status(201).json({
      success: true,
      message: 'Reward points added successfully'
    });
  } catch (error) {
    console.error('Add reward error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
