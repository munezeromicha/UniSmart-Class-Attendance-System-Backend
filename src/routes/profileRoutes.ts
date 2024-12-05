import express from 'express';
import { auth } from '../middleware/auth';
import * as profileController from '../controllers/profileController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 * 
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [ADMIN, HOD, LECTURER, CLASS_REP, STUDENT]
 *           description: User's role
 *         department:
 *           type: string
 *           description: User's department
 *         class:
 *           type: string
 *           description: User's class (if applicable)
 *         registrationNumber:
 *           type: string
 *           description: Student's registration number (if role is STUDENT)
 *         school:
 *           type: string
 *           description: User's school
 *   
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: No token provided
 */

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Profile'
 *             examples:
 *               student:
 *                 value:
 *                   user:
 *                     id: "123abc..."
 *                     firstName: "John"
 *                     lastName: "Smith"
 *                     email: "john.smith@example.com"
 *                     role: "STUDENT"
 *                     department: "Computer Science"
 *                     class: "CS-2024"
 *                     registrationNumber: "2024/BSC/CS/001"
 *                     school: "School of Computing"
 *               lecturer:
 *                 value:
 *                   user:
 *                     id: "456def..."
 *                     firstName: "Jane"
 *                     lastName: "Doe"
 *                     email: "jane.doe@example.com"
 *                     role: "LECTURER"
 *                     department: "Computer Science"
 *                     school: "School of Computing"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/me', auth(), profileController.getProfile);

export default router;