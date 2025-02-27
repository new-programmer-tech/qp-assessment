import express, { Request, Response, NextFunction ,Application } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// import { createAdmin } from './controllers/admin/create-admin';
// createAdmin();

const {createAdmin} = require('./controllers/admin/create-admin-api')
import { AdminInput } from './constants';

import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import adminRoutes from './routes/adminRoutes'

const {handleErrors} = require('../src/middleware/authenticateToken ')

dotenv.config();

const app: Application = express();

const port: number = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(handleErrors)
//Routes

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)

app.post('/create-admin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: AdminInput = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const admin = await createAdmin({ username, email, password });

    res.json({ message: 'Admin created successfully!', admin });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
