import db from '../config/database.js';

// Get notification settings
export const getNotificationSettings = async (req, res) => {
  try {
    let [settings] = await db.query(
      'SELECT * FROM notification_settings WHERE user_id = ?',
      [req.user.id]
    );

    // Create default settings if not exists
    if (settings.length === 0) {
      await db.query(
        `INSERT INTO notification_settings (user_id, email_orders, email_promotions, email_newsletters, 
         sms_orders, sms_promotions, push_orders, push_promotions) 
         VALUES (?, 1, 1, 1, 1, 0, 1, 1)`,
        [req.user.id]
      );

      [settings] = await db.query(
        'SELECT * FROM notification_settings WHERE user_id = ?',
        [req.user.id]
      );
    }

    res.json({
      success: true,
      data: settings[0]
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
  try {
    const {
      emailOrders,
      emailPromotions,
      emailNewsletters,
      smsOrders,
      smsPromotions,
      pushOrders,
      pushPromotions
    } = req.body;

    // Check if settings exist
    const [existing] = await db.query(
      'SELECT id FROM notification_settings WHERE user_id = ?',
      [req.user.id]
    );

    if (existing.length === 0) {
      // Create new settings
      await db.query(
        `INSERT INTO notification_settings 
         (user_id, email_orders, email_promotions, email_newsletters, 
          sms_orders, sms_promotions, push_orders, push_promotions) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, emailOrders, emailPromotions, emailNewsletters, 
         smsOrders, smsPromotions, pushOrders, pushPromotions]
      );
    } else {
      // Update existing settings
      await db.query(
        `UPDATE notification_settings 
         SET email_orders = ?, email_promotions = ?, email_newsletters = ?,
             sms_orders = ?, sms_promotions = ?, push_orders = ?, push_promotions = ?
         WHERE user_id = ?`,
        [emailOrders, emailPromotions, emailNewsletters, 
         smsOrders, smsPromotions, pushOrders, pushPromotions, req.user.id]
      );
    }

    res.json({
      success: true,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};
