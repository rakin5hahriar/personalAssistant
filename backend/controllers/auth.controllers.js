import User from '../models/User.js';
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

    return res.status(201).json(user);
} catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
}
};