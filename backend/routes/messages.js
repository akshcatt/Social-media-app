// routes/messages.js

import { Router } from 'express';
const router = Router();
import Message from '../models/message.js';


// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  const { username, text } = req.body;
  try {
    const newMessage = new Message({ username, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;