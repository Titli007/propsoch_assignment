require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database and models
    const db = await require('./models');
    
    // Import routes after db initialization
    const userRoutes = require('./routes/userRoutes');
    const expenseRoutes = require('./routes/expenseRoutes');
    const balanceRoutes = require('./routes/balanceRoutes');

    // Temporary middleware to simulate authenticated user
    app.use((req, res, next) => {
      req.user = { id: 1 }; // Simulate authenticated user
      next();
    });

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/expenses', expenseRoutes);
    app.use('/api/balances', balanceRoutes);

    // Database sync and server start
    await db.sequelize.sync();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();