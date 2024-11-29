const db = require('../models');
const { Op } = require('sequelize');

exports.createExpense = async (req, res) => {
  try {
    const { name, value, currency, memberIds = [], date } = req.body;
    const models = await db;
    console.log("-1", memberIds)
    
    // Verify that all users (creator and members) exist
    const uniqueUserIds = [...new Set([req.user.id, ...memberIds])];
    const existingUsers = await models.User.findAll({
      where: {
        id: {
          [Op.in]: uniqueUserIds
        }
      },
      attributes: ['id', 'email']
    });

    console.log("1",uniqueUserIds)
    console.log("2",existingUsers)

    if (existingUsers.length !== uniqueUserIds.length) {
      const foundIds = existingUsers.map(user => user.id);
      const missingIds = uniqueUserIds.filter(id => !foundIds.includes(id));
      return res.status(404).json({
        success: false,
        error: `Users not found with IDs: ${missingIds.join(', ')}`
      });
    }

    // Create the expense
    const expense = await models.Expense.create({
      name,
      value,
      currency,
      date: date || new Date(),
      createdBy: req.user.id
    });

    // Add all members to the expense
    await expense.setMembers(uniqueUserIds);

    // Calculate and update balances
    const sharePerPerson = value / uniqueUserIds.length;
    
    // Update or create balances between users
    for (const userId of uniqueUserIds) {
      if (userId !== req.user.id) {
        const [balance] = await models.Balance.findOrCreate({
          where: {
            userId: req.user.id,
            otherUserId: userId,
            currency
          },
          defaults: {
            amount: sharePerPerson
          }
        });

        if (balance) {
          await balance.increment('amount', { by: sharePerPerson });
        }

        // Create/update reciprocal balance
        const [reciprocalBalance] = await models.Balance.findOrCreate({
          where: {
            userId: userId,
            otherUserId: req.user.id,
            currency
          },
          defaults: {
            amount: -sharePerPerson
          }
        });

        if (reciprocalBalance) {
          await reciprocalBalance.decrement('amount', { by: sharePerPerson });
        }
      }
    }

    // Fetch the created expense with all associations
    const createdExpense = await models.Expense.findByPk(expense.id, {
      include: [
        {
          model: models.User,
          as: 'members',
          attributes: ['id', 'email']
        },
        {
          model: models.User,
          as: 'creator',
          attributes: ['id', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdExpense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const models = await db;
    
    const expenses = await models.Expense.findAll({
      include: [
        {
          model: models.User,
          as: 'members',
          attributes: ['id', 'email']
        },
        {
          model: models.User,
          as: 'creator',
          attributes: ['id', 'email']
        }
      ],
      where: {
        '$members.id$': req.user.id
      }
    });

    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};