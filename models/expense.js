module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Expense.belongsToMany(models.User, {
      through: 'ExpenseMembers',
      as: 'members'
    });
  };

  return Expense;
};