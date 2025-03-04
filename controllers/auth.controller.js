import moongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export const signUp = async (req, res, next) => {
    // implement sign up
    const session = await moongoose.startSession();
    session.startTransaction();

    try {
        // Create a new user
        const { name, email, password } = req.body;
        // check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([
            { name, email, password: hashedPassword }
        ], { session });

        const token = jwt.sign(
            { userId: newUsers[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        await session.commitTransaction();
        session.endSession();

        // sending the data to the client
        res.status(201).json({
            success: true, 
            message: 'User created successfully',
            data: {
                user: newUsers[0],
                token
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
        
    }

};

export const signIn = async (req, res, next) => {
    // implement sign in
    try {
        const { email, password } = req.body;

        // check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // validate the password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        // sending the data to the client
        res.status(200).json({
            success: true, 
            message: 'User signed in successfully',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error);
        
    }

};

export const signOut = async (req, res, next) => {
    // implement sign out
    try {
        const { email } = req.body;
        if (!email) {
            const error = new Error('Email is required');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'User signed out successfully'
        });
    } catch (error) {
        next(error);
        
    }
};