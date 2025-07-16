import express from 'express';
import { signUp, Login, Logout, getProfile, updateProfile } from '../controllers/auth.controllers.js';
import isAuth from '../middlewares/isAuth.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/signup', signUp);
authRouter.post('/login', Login);
authRouter.get('/logout', Logout);

// Protected routes (require authentication)
authRouter.get('/profile', isAuth, getProfile);
authRouter.put('/profile', isAuth, updateProfile);
authRouter.get('/check-auth', isAuth, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User is authenticated',
        user: req.user
    });
});

export default authRouter;