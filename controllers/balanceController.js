const db = require('../models');

exports.getUserBalances = async (req, res) => {
  try {
    const models = await db;
    
    const balances = await models.Balance.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: models.User,
          as: 'otherUser',
          attributes: ['id', 'email']
        }
      ]
    });

    res.json({
      success: true,
      data: balances
    });
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};