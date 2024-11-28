import express from 'express';
import { registerUser, loginUser, getUsers, getSingleUser, updateSingleUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser as express.RequestHandler);

router.post('/login', loginUser as express.RequestHandler);
router.get('/users', getUsers as express.RequestHandler);
router.get('/user/:id', getSingleUser as express.RequestHandler);
router.put('/user/update/:id',updateSingleUser as express.RequestHandler)

export default router;