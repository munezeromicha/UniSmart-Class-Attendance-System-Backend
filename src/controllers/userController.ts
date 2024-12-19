import { Request, Response } from 'express';
import User from '../models/User';

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if admin is trying to disable another admin
    if (user.role === 'ADMIN') {
      res.status(403).json({ message: 'Cannot modify admin accounts' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ message: 'User status toggled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.role === 'ADMIN') {
      res.status(403).json({ message: 'Cannot delete admin accounts' });
      return;
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 

