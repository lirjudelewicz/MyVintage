import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await User.find().select('-password');
    res.json(users);
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.json(user);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    if (req.params.id !== req.jwtUser!.userId) {
        res.status(403).json({ message: 'Forbidden: you can only update your own profile' });
        return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const allowed = ['username', 'profilePicture', 'biography'];
    allowed.forEach((field) => {
        if (req.body[field] !== undefined) {
            (user as unknown as Record<string, unknown>)[field] = req.body[field];
        }
    });

    await user.save();
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    if (req.params.id !== req.jwtUser!.userId) {
        res.status(403).json({ message: 'Forbidden: you can only delete your own account' });
        return;
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.json({ message: 'Account deleted successfully' });
};
