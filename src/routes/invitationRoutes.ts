import express, { Router } from 'express';
import { body } from 'express-validator';
import * as invitationController from '../controllers/invitationController';
import { auth } from '../middleware/auth';
import { UserRole } from '../models/User';
import { validate } from '../middleware/validate';

const router: Router = express.Router();

// Validation middleware for sending invitations
const sendInvitationValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(Object.values(UserRole)).withMessage('Invalid role'),
  body('school').optional().trim(),
  body('department').optional().trim(),
  body('class').optional().trim()
];

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: Invitation management endpoints
 * 
 * components:
 *   schemas:
 *     Invitation:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [HOD, LECTURER, CLASS_REP, STUDENT]
 *         school:
 *           type: string
 *         department:
 *           type: string
 *         class:
 *           type: string
 */

/**
 * @swagger
 * /api/invitations:
 *   post:
 *     summary: Send an invitation
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invitation'
 */
router.post(
  '/',
  auth([UserRole.ADMIN, UserRole.HOD, UserRole.CLASS_REP]),
  validate(sendInvitationValidation),
  (req, res) => invitationController.sendInvitation(req, res)
);

/**
 * @swagger
 * /api/invitations/verify/{token}:
 *   get:
 *     summary: Verify an invitation token
 *     tags: [Invitations]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 */
router.get(
  '/verify/:token',
  (req, res) => invitationController.verifyInvitation(req, res)
);

/**
 * @swagger
 * /api/invitations:
 *   get:
 *     summary: Get all active invitations
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/',
  auth([UserRole.ADMIN]),
  (req, res) => invitationController.getInvitations(req, res)
);

export default router;