import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            isPremium: user.is_premium
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, is_premium) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, false]
        );

        // Get created user
        const [users] = await db.query(
            'SELECT id, name, email, is_premium FROM users WHERE id = ?',
            [result.insertId]
        );

        const user = users[0];
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isPremium: Boolean(user.is_premium)
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isPremium: Boolean(user.is_premium)
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, is_premium, created_at FROM users WHERE id = ?',
            [req.user.id]
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
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// Google OAuth login/register
export const googleAuth = async (req, res) => {
    try {
        const { credential, name, email, picture } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required for Google authentication'
            });
        }

        // Check if user exists with this email
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        let user;

        if (existingUsers.length > 0) {
            // User exists, update their info if they're not already OAuth user
            user = existingUsers[0];
            
            // Update to OAuth if they weren't already
            if (user.auth_provider !== 'google') {
                await db.query(
                    'UPDATE users SET google_id = ?, auth_provider = ?, avatar_url = ? WHERE id = ?',
                    [credential, 'google', picture, user.id]
                );
            }
        } else {
            // Create new user
            const [result] = await db.query(
                'INSERT INTO users (name, email, google_id, auth_provider, avatar_url, is_premium) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, credential, 'google', picture, false]
            );

            // Get created user
            const [newUsers] = await db.query(
                'SELECT * FROM users WHERE id = ?',
                [result.insertId]
            );
            user = newUsers[0];
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Google authentication successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isPremium: Boolean(user.is_premium),
                    avatarUrl: user.avatar_url
                },
                token
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Error with Google authentication',
            error: error.message
        });
    }
};
