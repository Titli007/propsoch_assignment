const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabaseIfNotExists() {
  try {
    // Create a connection to MySQL server without database selection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
    console.log('Database created or verified successfully');
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}

// Initialize Sequelize after ensuring database exists
const initializeSequelize = async () => {
  await createDatabaseIfNotExists();

  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: false
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Export a promise that resolves to the sequelize instance
module.exports = initializeSequelize();