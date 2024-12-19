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

    if (senderRole === UserRole.CLASS_REP && role === UserRole.STUDENT) {
      if (!department || !className) {
        res.status(400).json({
          message: 'Department and class must be provided when inviting students'
        });
        return;
      }

      console.log('Validation Data:', {
        requestDept: department,
        userDept: req.user?.department,
        requestClass: className,
        userClass: req.user?.class
      });

      if (department.toLowerCase() !== req.user?.department?.toLowerCase() || 
          className.toLowerCase() !== req.user?.class?.toLowerCase()) {
        res.status(403).json({
          message: 'You can only invite students to your own department and class'
        });
        return;
      }

    }

    const token = generateInvitationToken();
    const invitation = new Invitation({
      email,
      role,
      school,
      department,
      class: className,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      invitedBy: req.user?.userId
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
    }).populate('invitedBy', 'department class');

    if (!invitation) {
      res.status(400).json({ message: 'Invalid or expired invitation token' });
      return;
    }

    if (invitation.role === UserRole.STUDENT) {
      if (!invitation.department || !invitation.class) {
        res.status(400).json({ 
          message: 'Invalid invitation: missing department or class information'
        });
        return;
      }
    }

    res.status(200).json({
      message: 'Valid invitation token',
      invitation: {
        email: invitation.email,
        role: invitation.role,
        school: invitation.school,
        department: invitation.department,
        class: invitation.class,
        invitedBy: invitation.invitedBy
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