// backend/src/index.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
// import cors from `cors`;
import dotenv from 'dotenv';
import sequelize from './sequelize';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files

// Routes
// app.use('/api', userRoutes);
app.use('/api/users', userRoutes);


// Health Check
app.get('/', (req: Request, res: Response) => {
  res.send('User Management API');
});

// Initialize Server and Database
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true }); // Sync models
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
