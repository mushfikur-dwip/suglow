-- Add profile_picture column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255) DEFAULT NULL;

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  email_orders BOOLEAN DEFAULT true,
  email_promotions BOOLEAN DEFAULT true,
  email_newsletters BOOLEAN DEFAULT true,
  sms_orders BOOLEAN DEFAULT true,
  sms_promotions BOOLEAN DEFAULT false,
  push_orders BOOLEAN DEFAULT true,
  push_promotions BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_settings (user_id)
);
