import jwt from 'jsonwebtoken';

export const genToken = async (userId) => {
    try {
        const token = jwt.sign(
            { userId }, 
            process.env.JWT_SECRET || 'your-secret-key', 
            { expiresIn: '10h' }
        );
        return token;
    } catch (error) {
        throw new Error('Token generation failed');
    }
};

export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded;
    } catch (error) {
        throw new Error('Token verification failed');
    }
};
