import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAuthToken = (
  userId: string, 
  role: string, 
  department?: string, 
  class_name?: string
): string => {
  return jwt.sign(
    { 
      userId, 
      role, 
      department: department || '', 
      class: class_name || '' 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

export const generateInvitationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
}; 