const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// @route   POST /api/contact
// @desc    Send contact form email
// @access  Public
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('message').trim().notEmpty().withMessage('Message is required'),
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { name, email, message } = req.body;

            // Check if email configuration exists
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.error('Email configuration missing in environment variables');
                return res.status(500).json({
                    success: false,
                    message: 'Email service is not configured. Please contact the administrator.',
                });
            }

            // Create transporter
            const transporter = createTransporter();

            // Email to admin
            const mailOptions = {
                from: `"IremeCorner Academy Contact Form" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                replyTo: email,
                subject: 'New Contact Form Submission - IremeCorner Academy',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #FD7E14; margin-bottom: 20px; border-bottom: 3px solid #FD7E14; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #666;">
                  <strong style="color: #202F32;">From:</strong> ${name}
                </p>
                <p style="margin: 5px 0; color: #666;">
                  <strong style="color: #202F32;">Email:</strong> 
                  <a href="mailto:${email}" style="color: #FD7E14; text-decoration: none;">${email}</a>
                </p>
                <p style="margin: 5px 0; color: #666;">
                  <strong style="color: #202F32;">Date:</strong> ${new Date().toLocaleString()}
                </p>
              </div>

              <div style="background-color: #FAF1E6; padding: 20px; border-radius: 5px; border-left: 4px solid #FD7E14;">
                <h3 style="color: #202F32; margin-top: 0;">Message:</h3>
                <p style="color: #202F32; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
                <p>This email was sent from the IremeCorner Academy contact form.</p>
                <p>Reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          </div>
        `,
                text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Date: ${new Date().toLocaleString()}

Message:
${message}

---
This email was sent from the IremeCorner Academy contact form.
Reply directly to this email to respond to ${name}.
        `,
            };

            // Send email
            await transporter.sendMail(mailOptions);

            console.log(`Contact form email sent from ${email}`);

            res.status(200).json({
                success: true,
                message: 'Your message has been sent successfully! We will get back to you soon.',
            });
        } catch (error) {
            console.error('Error sending contact form email:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later or contact us directly.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            });
        }
    }
);

module.exports = router;
