-- Allow guest users to place orders
-- Make user_id nullable in addresses and orders tables

ALTER TABLE addresses MODIFY COLUMN user_id INT NULL;
ALTER TABLE orders MODIFY COLUMN user_id INT NULL;

-- Make guest_email required when user_id is null
ALTER TABLE orders MODIFY COLUMN guest_email VARCHAR(255) NULL;

-- Verify changes
DESCRIBE addresses;
DESCRIBE orders;
