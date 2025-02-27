
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AdminInput } from '../../constants';

const prisma = new PrismaClient();

const createAdmin = async ({ username, email, password }: AdminInput) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'admin'
      }
    });
  } catch (error) {
    throw new Error('Error creating admin user');
  }
};

module.exports = createAdmin