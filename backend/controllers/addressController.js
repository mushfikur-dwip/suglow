import db from '../config/database.js';

// Get user addresses
export const getAddresses = async (req, res) => {
  try {
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create address
export const createAddress = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, addressLine1, addressLine2, city, state, postalCode, country, type, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.query(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND type = ?',
        [req.user.id, type || 'shipping']
      );
    }

    const [result] = await db.query(
      `INSERT INTO addresses (user_id, type, first_name, last_name, email, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, type || 'shipping', firstName, lastName, email, phone, addressLine1, addressLine2, city, state, postalCode, country || 'Bangladesh', isDefault || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

    // Check if address belongs to user
    const [existing] = await db.query(
      'SELECT type FROM addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.query(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND type = ?',
        [req.user.id, existing[0].type]
      );
    }

    await db.query(
      `UPDATE addresses 
       SET first_name = ?, last_name = ?, email = ?, phone = ?, address_line1 = ?, address_line2 = ?, 
           city = ?, state = ?, postal_code = ?, country = ?, is_default = ?
       WHERE id = ? AND user_id = ?`,
      [firstName, lastName, email, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault || 0, id, req.user.id]
    );

    res.json({
      success: true,
      message: 'Address updated successfully'
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Get address type
    const [address] = await db.query(
      'SELECT type FROM addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (address.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Unset other defaults
    await db.query(
      'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND type = ?',
      [req.user.id, address[0].type]
    );

    // Set this as default
    await db.query(
      'UPDATE addresses SET is_default = 1 WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Default address updated'
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ success: false, message: 'Failed to set default address' });
  }
};
