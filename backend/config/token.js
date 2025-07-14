import jwt from 'jsonwebtoken';

const genToken = async (userId) => {
    try {
        // Generate a token using the user's ID and a secret key
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10h' });
        return token;
    } catch (error) {
        throw new Error('Token generation failed');
    }
}

export default genToken;

