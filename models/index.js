const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const db = {};

const initializeModels = async () => {
  try {
    const sequelize = await require('../db/config');
    const basename = path.basename(__filename);

    // Read model files
    const modelFiles = fs.readdirSync(__dirname)
      .filter(file => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
        );
      });

    // Initialize models
    for (const file of modelFiles) {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }

    // Set up associations
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
  } catch (error) {
    console.error('Error initializing models:', error);
    throw error;
  }
};

module.exports = initializeModels();