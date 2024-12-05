import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAuthToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

export const generateInvitationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
}; 