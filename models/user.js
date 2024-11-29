module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    defaultCurrency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Expense, {
      foreignKey: 'createdBy',
      as: 'createdExpenses'
    });
    User.belongsToMany(models.Expense, {
      through: 'ExpenseMembers',
      as: 'expenses'
    });
  };

  return User;
};