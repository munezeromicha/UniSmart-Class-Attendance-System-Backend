import { Request, Response } from 'express';
import { UserRole } from '../models/User';
import Invitation from '../models/Invitation';
import EmailService from '../services/EmailService';
import { generateInvitationToken } from '../utils/tokenUtils';

export const sendInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, role, school, department, class: className } = req.body;
    const senderRole = (req.user?.role || '').toUpperCase() as UserRole;

    const allowedInvitations: Record<UserRole, UserRole[]> = {
      [UserRole.ADMIN]: [UserRole.HOD],
      [UserRole.HOD]: [UserRole.LECTURER, UserRole.CLASS_REP],
      [UserRole.CLASS_REP]: [UserRole.STUDENT],
      [UserRole.LECTURER]: [],
      [UserRole.STUDENT]: []
    };

    if (!allowedInvitations[senderRole]?.includes(role)) {
      res.status(403).json({ 
        message: 'Not authorized to send this type of invitation'
      });
      return;
    }

    const token = generateInvitationToken();
    const invitation = new Invitation({
      email,
      role,
      school,
      department,
      class: className,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await invitation.save();
    await EmailService.sendInvitation(email, role, token, { school, department, class: className });

    res.status(200).json({ 
      message: 'Invitation sent successfully',
      details: { email, role, school, department, class: className }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const invitation = await Invitation.findOne({
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      res.status(400).json({ message: 'Invalid or expired invitation token' });
      return;
    }

    res.status(200).json({
      message: 'Valid invitation token',
      invitation: {
        email: invitation.email,
        role: invitation.role,
        school: invitation.school,
        department: invitation.department,
        class: invitation.class
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInvitations = async (req: Request, res: Response): Promise<void> => {
  try {
    const invitations = await Invitation.find({
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    
    res.status(200).json(invitations);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};