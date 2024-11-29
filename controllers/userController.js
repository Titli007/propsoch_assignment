const bcrypt = require('bcryptjs');

// Get models after initialization
const db = require('../models');

exports.createUser = async (req, res) => {
  try {
    const { id, email, password, defaultCurrency } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID is required'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const User = (await db).User;

    // Check if ID already exists
    const existingUser = await User.findByPk(id);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this ID already exists'
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }

    const user = await User.create({
      id,
      email,
      password: hashedPassword,
      defaultCurrency: defaultCurrency || 'USD'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        defaultCurrency: user.defaultCurrency
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create user'
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { email, defaultCurrency } = req.body;
    const User = (await db).User;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if new email already exists for another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use'
        });
      }
    }

    await user.update({ email, defaultCurrency });
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        defaultCurrency: user.defaultCurrency
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const User = (await db).User;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.destroy();
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};