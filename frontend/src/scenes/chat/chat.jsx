// components/Chat.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:8001/messages');
        const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:8001/messages', { username, text });
      await fetchMessages();
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box p={2} maxWidth={600} mx="auto">
      <Typography variant="h5" gutterBottom>
        Community Chat
      </Typography>
      <Box
        height={300}
        overflow="auto"
        border="1px solid #ccc"
        borderRadius={4}
        p={2}
        mb={2}
        sx={{ 
          '@media (max-width: 600px)': {
            height: 200,
          },
        }}
      >
        {messages.map((message, index) => (
          <Box key={index} mb={1}>
            <Typography variant="subtitle1">
              <strong>{message.username}: </strong>
              {message.text}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(message.timestamp).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        mb={1}
      />
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        mb={1}
      />
      <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
        Send
      </Button>
    </Box>
  );
};

export default Chat;