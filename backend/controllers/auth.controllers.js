import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { genToken } from '../utils/token.js';

export const signUp = async (req, res) => {
try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    //6 password
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the password (you can use bcrypt or any other library for hashing)
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create a new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = await genToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'strict',
        maxAge: 10 * 60 * 60 * 1000 // 10 hours
    });

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: userResponse
    });
} catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
}
};


export const Login = async (req, res) => {
try {
    const { email, password } = req.body;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }


    //6 password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = await genToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'strict',
        maxAge: 10 * 60 * 60 * 1000 // 10 hours
    });

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: userResponse
    });
} catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
}
};

export const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ 
            success: true,
            message: 'Logged out successfully' 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        // User is already attached to req by isAuth middleware
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user._id;

        // Check if email is being changed and if it already exists
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                ...(name && { name }),
                ...(email && { email })
            },
            { new: true, select: '-password' }
        );

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};