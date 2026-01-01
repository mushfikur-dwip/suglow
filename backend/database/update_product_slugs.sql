-- Update existing products to add slugs if they don't have them
UPDATE products 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(name, ' ', '-'), '\'', ''), '%', 'percent'), '+', 'plus'))
WHERE slug IS NULL OR slug = '';

-- Verify all products have slugs
SELECT id, name, slug FROM products;
