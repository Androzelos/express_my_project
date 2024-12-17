import { User } from '../mongoose/schema/user.mjs';
import { validationResult, matchedData } from 'express-validator'; 
import { hashPassword } from '../utils/helpers.mjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import exp from 'constants';

export const createUserHandler = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (err) {
        console.log(err.errorResponse);
        return res.sendStatus(400);
    }
}

export const forgotPasswordHandler = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find user and validate
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ 
                success: false, 
                message: "If a user with this email exists, they will receive password reset instructions." 
            });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/api/users/forgotPassword?token=${resetToken}`;

        // Configure email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <h1>Password Reset Request</h1>
                <p>Hello ${user.name},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>${process.env.APP_NAME} Team</p>
            `
        };
    
        await transporter.sendMail(mailOptions);
        
        return res.status(200).send({ 
            success: true, 
            message: "Password reset instructions have been sent to your email."
        });

    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).send({ 
            success: false, 
            message: "An error occurred while processing your request."
        });
    }
}

export const resetPasswordHandler = async (req, res) => {
    
}