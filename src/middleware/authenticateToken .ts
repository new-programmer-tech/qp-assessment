import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
const { body, validationResult } = require("express-validator");

import {User} from '../constants'

// Authentication middleware
const authenticateToken = (req: Request & { user?: User }, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] || req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret', (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user as User;
    next();
  });
};


// =====================================================
// Admin authorization middleware
const isAdmin = (req: Request & { user?: User }, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};


//===========================================================
// Error handling middleware
const handleErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

//===========================================================


module.exports = {authenticateToken ,handleErrors}