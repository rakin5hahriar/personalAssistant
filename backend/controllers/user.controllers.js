import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import uploadOnCloudinary from '../config/cloudinary.js';

// Get current authenticated user
export const getCurrentUser = async (req, res) => {
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
            message: 'Current user retrieved successfully',
            user: user
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users: users,
            count: users.length
        });
    } catch (error) {
        console.error('Get all users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            user: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user password
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Get user with password
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete user account
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        // Clear cookie
        res.clearCookie('token');

        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Calculate user statistics
        const stats = {
            accountCreated: user.createdAt,
            lastUpdated: user.updatedAt,
            accountAge: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)), // days
            // Add more stats as needed for your virtual assistant
            totalSessions: 0, // You can implement session tracking
            totalQueries: 0,  // You can implement query tracking
        };

        return res.status(200).json({
            success: true,
            message: 'User statistics retrieved successfully',
            stats: stats
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Search users (Admin only)
export const searchUsers = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchRegex = new RegExp(query, 'i');
        
        const users = await User.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex }
            ]
        })
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

        const total = await User.countDocuments({
            $or: [
                { name: searchRegex },
                { email: searchRegex }
            ]
        });

        return res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            users: users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Search users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user preferences (for virtual assistant settings)
export const updatePreferences = async (req, res) => {
    try {
        const userId = req.user._id;
        const { preferences } = req.body;

        if (!preferences || typeof preferences !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Valid preferences object is required'
            });
        }

        // Update user with preferences
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $set: { 
                    preferences: preferences,
                    updatedAt: new Date()
                }
            },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Upload user image (avatar)
export const uploadUserImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Upload to cloudinary
        const imageUrl = await uploadOnCloudinary(req.file.path);
        
        if (!imageUrl) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image to cloud storage'
            });
        }

        // Update user's assistantImage
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { assistantImage: imageUrl },
            { new: true, select: '-password' }
        );

        return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            user: updatedUser
        });

    } catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during image upload',
            error: error.message
        });
    }
};

// Update user profile (name, assistantName, assistantDescription, assistantImage)
export const updateProfile = async (req, res) => {
    try {
        const { name, assistantName, assistantDescription, assistantImage } = req.body;
        
        // Build update object with only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (assistantName !== undefined) updateData.assistantName = assistantName;
        if (assistantDescription !== undefined) updateData.assistantDescription = assistantDescription;
        if (assistantImage !== undefined) updateData.assistantImage = assistantImage;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during profile update',
            error: error.message
        });
    }
};

// Send message to assistant (placeholder for AI integration)
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Store the message in user's history
        const user = await User.findById(req.user._id);
        if (!user.history) {
            user.history = [];
        }
        
        user.history.push(`User: ${message}`);
        
        // Simple AI response logic (you can replace with actual AI API)
        const responses = [
            "That's an interesting question! Let me help you with that.",
            "I understand what you're asking. Here's what I think...",
            "Great question! Based on what you've told me, I'd suggest...",
            "I'm here to help! Let me break this down for you.",
            "That's a thoughtful inquiry. Here's my perspective...",
            "I appreciate you asking! Here's what I would recommend...",
            `Thanks for sharing that with me, ${user.name || 'friend'}!`
        ];
        
        const aiResponse = responses[Math.floor(Math.random() * responses.length)];
        user.history.push(`Assistant: ${aiResponse}`);
        
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            response: aiResponse,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Send message error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during message processing',
            error: error.message
        });
    }
};
