const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Create an HTTP server and attach Socket.IO
const PORT = process.env.PORT || 5000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Socket.IO configuration for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for document updates and broadcast to others
  socket.on('doc-update', (data) => {
    socket.broadcast.emit('doc-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));