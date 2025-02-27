import express, { Request, Response, NextFunction ,Application } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import adminRoutes from './routes/authRoutes'

const {handleErrors} = require('../src/middleware/authenticateToken ')

dotenv.config();

const app: Application = express();

const port: number = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(handleErrors)
//Routes

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin' , adminRoutes)


app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
