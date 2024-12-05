import mongoose from 'mongoose';
import User from '../models/User';
import { UserRole } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const createInitialAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'munezeromicha2000@gmail.com',
      password: 'Admin@12345',
      role: UserRole.ADMIN,
      isActive: true
    });

    await adminUser.save();
    console.log('Initial admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createInitialAdmin();