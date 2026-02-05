import bcrypt from 'bcryptjs';
import db from '../config/database.js';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query(
            'SELECT id, name, email, is_premium, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                isPremium: Boolean(user.is_premium),
                memberSince: user.created_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        // Check if email is already taken by another user
        if (email) {
            const [existingUsers] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, userId]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already taken'
                });
            }
        }

        // Build update query dynamically
        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }

        if (email) {
            updates.push('email = ?');
            params.push(email);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        params.push(userId);

        await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        // Get updated user
        const [users] = await db.query(
            'SELECT id, name, email, is_premium FROM users WHERE id = ?',
            [userId]
        );

        const user = users[0];

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                isPremium: Boolean(user.is_premium)
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Get user's current password
        const [users] = await db.query(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        // Verify current passwordconst isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

// Upgrade to premium
export const upgradeToPremium = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user is already premium
        const [users] = await db.query(
            'SELECT is_premium FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (users[0].is_premium) {
            return res.status(400).json({
                success: false,
                message: 'User is already a premium member'
            });
        }

        // Update to premium
        await db.query(
            'UPDATE users SET is_premium = true WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Successfully upgraded to premium membership'
        });
    } catch (error) {
        console.error('Upgrade to premium error:', error);
        res.status(500).json({
            success: false,
            message: 'Error upgrading to premium',
            error: error.message
        });
    }
};
