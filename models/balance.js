module.exports = (sequelize, DataTypes) => {
  const Balance = sequelize.define('Balance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    otherUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Balance.associate = (models) => {
    Balance.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Balance.belongsTo(models.User, {
      foreignKey: 'otherUserId',
      as: 'otherUser'
    });
  };

  return Balance;
};