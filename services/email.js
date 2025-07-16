import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();


AWS.config.update({
  region: 'ap-southeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const transporter = nodemailer.createTransport({ SES: ses });



/**
 * Send welcome email to new user
 * @param {string} email - Recipient email address
 */
export const sendWelcomeEmail = async (email) => {
    const mailOptions = {
        from: process.env.SES_FROM_EMAIL || 'noreply@yourdomain.com',
        to: email,
        subject: 'Welcome to Our Platform!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Welcome!</h1>
                <p>Thank you for signing up for our platform.</p>
                <p>Your account has been created successfully.</p>
                <p>You can now log in and start using our services.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    If you didn't create this account, please ignore this email.
                </p>
            </div>
        `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', email);
        return result;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.SES_FROM_EMAIL || 'noreply@yourdomain.com',
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Password Reset</h1>
                <p>You requested a password reset for your account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #007bff; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #666;">This link will expire in 1 hour.</p>
                <p style="color: #666;">If you didn't request this, please ignore this email.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${resetUrl}">${resetUrl}</a>
                </p>
            </div>
        `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully to:', email);
        return result;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

/**
 * Send verification email
 * @param {string} email - Recipient email address
 * @param {string} verificationToken - Email verification token
 */
export const sendVerificationEmail = async (email, verificationToken) => {
    const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/verify-email/${verificationToken}`;
    
    const mailOptions = {
        from: process.env.SES_FROM_EMAIL || 'noreply@yourdomain.com',
        to: email,
        subject: 'Please Verify Your Email Address',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Verify Your Email</h1>
                <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #28a745; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p style="color: #666;">This link will expire in 24 hours.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${verificationUrl}">${verificationUrl}</a>
                </p>
            </div>
        `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to:', email);
        return result;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

/**
 * Send custom email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
export const sendCustomEmail = async ({ to, subject, html, text }) => {
    const mailOptions = {
        from: process.env.SES_FROM_EMAIL || 'noreply@yourdomain.com',
        to,
        subject,
        html,
        ...(text && { text })
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Custom email sent successfully to:', to);
        return result;
    } catch (error) {
        console.error('Error sending custom email:', error);
        throw error;
    }
};

export default {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendCustomEmail
};
