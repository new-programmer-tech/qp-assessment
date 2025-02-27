import express, { Request, Response, NextFunction ,Application } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes'

dotenv.config();

const app: Application = express();

// Initialize Prisma
const prisma = new PrismaClient();

const port: number = Number(process.env.PORT) || 5000;

app.use(express.json());

//Routes

app.use('/api/user', userRoutes)


app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
