-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id INT NOT NULL,
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  received_date DATE,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status ENUM('pending', 'approved', 'in_transit', 'received', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
  payment_method VARCHAR(50),
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Purchase Order Items Table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  received_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  tax_id VARCHAR(100),
  payment_terms VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default suppliers
INSERT INTO suppliers (name, company_name, email, phone, address, city, country, status) VALUES
('Beauty Wholesale BD', 'Beauty Wholesale Bangladesh Ltd', 'info@beautywholesale.com', '+880-1711-123456', 'House 10, Road 5, Dhanmondi', 'Dhaka', 'Bangladesh', 'active'),
('Cosmetics Import Ltd', 'Cosmetics Import Limited', 'contact@cosmeticsimport.com', '+880-1811-234567', '123 Gulshan Avenue', 'Dhaka', 'Bangladesh', 'active'),
('Skin Care Suppliers', 'Skin Care Suppliers Co', 'sales@skincaresuppliers.com', '+880-1911-345678', '45 Banani Road', 'Dhaka', 'Bangladesh', 'active'),
('Natural Products Co', 'Natural Products Company', 'info@naturalproducts.com', '+880-1611-456789', '78 Uttara Sector 7', 'Dhaka', 'Bangladesh', 'active'),
('Global Beauty Imports', 'Global Beauty Imports Ltd', 'orders@globalbeauty.com', '+880-1511-567890', '90 Motijheel C/A', 'Dhaka', 'Bangladesh', 'active');
