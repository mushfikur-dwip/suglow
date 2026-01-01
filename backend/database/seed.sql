USE suglow_db;

-- Insert Default Admin User (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role, status) VALUES
('admin@kirei.com', '$2a$10$XQZqQx3z5X5Z5Z5Z5Z5Z5.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Admin', 'User', 'admin', 'active'),
('manager@kirei.com', '$2a$10$XQZqQx3z5X5Z5Z5Z5Z5Z5.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Manager', 'User', 'manager', 'active');

-- Note: The password hash above is a placeholder. It will be generated properly when you run the backend
-- For now, we'll handle admin creation in the backend code during first run

-- Insert Sample Categories
INSERT INTO categories (name, slug, description, status) VALUES
('Skincare', 'skincare', 'Complete range of skincare products', 'active'),
('Haircare', 'haircare', 'Professional haircare solutions', 'active'),
('Makeup', 'makeup', 'Premium makeup products', 'active'),
('Fragrance', 'fragrance', 'Luxury fragrances', 'active'),
('Body Care', 'body-care', 'Body care essentials', 'active'),
('Men', 'men', 'Grooming products for men', 'active');

-- Insert Sample Products
INSERT INTO products (sku, name, slug, short_description, category_id, brand, price, sale_price, stock_quantity, main_image, featured, trending, status) VALUES
('SK-001', 'COSRX Advanced Snail 96 Mucin Power Essence', 'cosrx-snail-mucin-essence', 'Lightweight essence with 96% snail secretion filtrate repairs and rejuvenates skin', 1, 'COSRX', 1650.00, 1450.00, 50, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', TRUE, TRUE, 'active'),
('SK-002', 'The Ordinary Niacinamide 10% + Zinc 1%', 'the-ordinary-niacinamide-zinc', 'Reduces appearance of skin blemishes and congestion', 1, 'The Ordinary', 850.00, NULL, 75, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500', TRUE, TRUE, 'active'),
('SK-003', 'CeraVe Hydrating Facial Cleanser', 'cerave-hydrating-cleanser', 'Gentle cleanser with ceramides and hyaluronic acid', 1, 'CeraVe', 1200.00, 999.00, 100, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', FALSE, TRUE, 'active'),
('SK-004', 'La Roche-Posay Anthelios Sunscreen SPF 50', 'la-roche-posay-sunscreen-spf50', 'Broad spectrum UVA/UVB protection for all skin types', 1, 'La Roche-Posay', 2200.00, 1950.00, 60, 'https://images.unsplash.com/photo-1564142608842-87f200f9278f?w=500', TRUE, FALSE, 'active'),
('SK-005', 'Omi Brotherhood Menturm Acne Lotion 110ml', 'omi-brotherhood-acne-lotion', 'Japanese acne treatment lotion for clear skin', 1, 'Omi Brotherhood', 1650.00, NULL, 40, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', TRUE, TRUE, 'active'),
('SK-006', 'Paula\'s Choice 2% BHA Liquid Exfoliant', 'paulas-choice-bha-exfoliant', 'Salicylic acid exfoliant for smoother, clearer skin', 1, 'Paula\'s Choice', 2850.00, 2500.00, 35, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500', TRUE, FALSE, 'active'),
('SK-007', 'Neutrogena Hydro Boost Water Gel', 'neutrogena-hydro-boost-gel', 'Oil-free gel cream with hyaluronic acid', 1, 'Neutrogena', 1450.00, 1200.00, 80, 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500', FALSE, TRUE, 'active'),
('HC-001', 'Kerastase Resistance Shampoo', 'kerastase-resistance-shampoo', 'Professional strengthening shampoo for damaged hair', 2, 'Kerastase', 2500.00, 2200.00, 45, 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500', TRUE, FALSE, 'active'),
('MK-001', 'MAC Ruby Woo Matte Lipstick', 'mac-ruby-woo-lipstick', 'Iconic red matte lipstick with long-lasting formula', 3, 'MAC Cosmetics', 2200.00, NULL, 65, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500', TRUE, TRUE, 'active'),
('BC-001', 'Nivea Nourishing Body Lotion', 'nivea-body-lotion', 'Deep moisture for 48h hydration with Vitamin E', 5, 'Nivea', 650.00, 550.00, 120, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500', FALSE, TRUE, 'active');

-- Insert Sample FAQs
INSERT INTO faqs (category, question, answer, display_order, status) VALUES
('Shipping', 'What is your shipping policy?', 'We ship nationwide within 3-5 business days. Free shipping on orders above ৳2000.', 1, 'active'),
('Returns', 'How do I return a product?', 'You can return products within 14 days of delivery. Product must be unused and in original packaging.', 2, 'active'),
('Payment', 'What payment methods do you accept?', 'We accept Cash on Delivery, bKash, Nagad, and all major credit/debit cards.', 3, 'active'),
('Products', 'Are your products authentic?', 'Yes, we source all products directly from authorized distributors and manufacturers.', 4, 'active');

-- Insert Sample Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit, valid_from, valid_until, status) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 1000.00, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active'),
('SAVE500', 'Flat ৳500 off on orders above ৳3000', 'fixed', 500.00, 3000.00, 50, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'active');
