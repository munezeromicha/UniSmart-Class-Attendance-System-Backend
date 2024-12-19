import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import Invitation from '../models/Invitation';
import { generateAuthToken } from '../utils/tokenUtils';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      token,
      registrationNumber 
    } = req.body;

    // Check invitation
    const invitation = await Invitation.findOne({
      token,
      email,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      res.status(400).json({ message: 'Invalid or expired invitation token' });
      return;
    }

    // Additional validation for student registration
    if (invitation.role === UserRole.STUDENT && !registrationNumber) {
      res.status(400).json({ message: 'Registration number is required for students' });
      return;
    }

    // Check if registration number already exists (for students)
    if (registrationNumber) {
      const existingUser = await User.findOne({ registrationNumber });
      if (existingUser) {
        res.status(400).json({ message: 'Registration number already exists' });
        return;
      }
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: invitation.role,
      department: invitation.department,
      school: invitation.school,
      class: invitation.class,
      ...(invitation.role === UserRole.STUDENT && { registrationNumber })
    });

    await user.save();

    // Mark invitation as used
    invitation.isUsed = true;
    await invitation.save();

    // Generate token
    const authToken = generateAuthToken(user.id, user.role);

    res.status(200).json({
      message: 'Registration successful',
      token: authToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        class: user.class,
        registrationNumber: user.registrationNumber
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      res.status(400).json({ 
        message: 'Email or registration number already exists' 
      });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
console.log(user.class,'gggggggggggggggggg')
    const token = generateAuthToken(user.id, user.role,user.department,user.class);

    res.status(200).json({
      token,
      user: {
        firstName:user.firstName,
        lastName:user. lastName,
        id: user.id,
        email: user.email,
        role: user.role,
        department:user.department,
        class:user.class,
        registrationNumber:user.registrationNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};