import db from '../config/database.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch categories' 
    });
  }
};

// Create category
export const createCategory = async (req, res) => {
  try {
    console.log('📦 Create category request body:', req.body);
    const { name, slug, description } = req.body;

    if (!name) {
      console.log('❌ Category name missing');
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log('🏷️ Generated slug:', categorySlug);

    // Check if slug already exists
    const [[existing]] = await db.query(
      'SELECT id FROM categories WHERE slug = ?',
      [categorySlug]
    );

    if (existing) {
      console.log('⚠️ Slug already exists:', categorySlug);
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, categorySlug, description || null]
    );

    console.log('✅ Category created with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { 
        id: result.insertId,
        name,
        slug: categorySlug,
        description
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    await db.query(
      'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name, slug, description || null, id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update category' 
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );

    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${count} product(s) are using this category`
      });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete category' 
    });
  }
};
