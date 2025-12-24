const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all unique users the current user has messaged with
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate('sender', 'name email avatar role')
            .populate('receiver', 'name email avatar role')
            .sort({ createdAt: -1 });

        // Group by conversation partner
        const conversationsMap = new Map();

        messages.forEach((message) => {
            const partnerId =
                message.sender._id.toString() === userId
                    ? message.receiver._id.toString()
                    : message.sender._id.toString();

            if (!conversationsMap.has(partnerId)) {
                const partner =
                    message.sender._id.toString() === userId
                        ? message.receiver
                        : message.sender;

                conversationsMap.set(partnerId, {
                    partner,
                    lastMessage: message,
                    unreadCount: 0,
                });
            }

            // Count unread messages from partner
            if (
                message.receiver._id.toString() === userId &&
                !message.read
            ) {
                conversationsMap.get(partnerId).unreadCount++;
            }
        });

        const conversations = Array.from(conversationsMap.values());

        res.json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get messages with specific user
// @access  Private
router.get('/conversation/:userId', protect, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId },
            ],
        })
            .populate('sender', 'name email avatar role')
            .populate('receiver', 'name email avatar role')
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            {
                sender: otherUserId,
                receiver: currentUserId,
                read: false,
            },
            {
                read: true,
                readAt: new Date(),
            }
        );

        res.json({
            success: true,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
});

// @route   POST /api/messages/send
// @desc    Send a new message
// @access  Private
router.post('/send', protect, async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({
                success: false,
                message: 'Receiver and content are required',
            });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found',
            });
        }

        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name email avatar role')
            .populate('receiver', 'name email avatar role');

        res.status(201).json({
            success: true,
            data: populatedMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
});

// @route   PUT /api/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:messageId/read', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found',
            });
        }

        // Only receiver can mark as read
        if (message.receiver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        message.read = true;
        message.readAt = new Date();
        await message.save();

        res.json({
            success: true,
            data: message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
});

// @route   GET /api/messages/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user.id,
            read: false,
        });

        res.json({
            success: true,
            data: { count },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
});

module.exports = router;
