import express, { NextFunction } from 'express';
import * as userController from '../controllers/userController';
import { auth } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.patch('/:userId/toggle-status', 
  auth([UserRole.ADMIN, UserRole.HOD]) as express.RequestHandler,
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      await userController.toggleUserStatus(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:userId', 
  auth([UserRole.ADMIN]) as express.RequestHandler,
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      await userController.deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 