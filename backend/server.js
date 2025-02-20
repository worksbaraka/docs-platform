const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for the document (for demonstration purposes)
let currentDocument = '';

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Endpoint to retrieve the current document
app.get('/document', (req, res) => {
    res.json({ document: currentDocument });
  });
  
  // Endpoint to update the document
  app.post('/document', (req, res) => {
    const { document } = req.body;
    currentDocument = document;
    res.json({ message: 'Document updated', document: currentDocument });
  });

// Create an HTTP server, attach Socket.IO
const PORT = process.env.PORT || 5000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Socket.IO configuration for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for doc updates and broadcast
  socket.on('doc-update', (data) => {
    socket.broadcast.emit('doc-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));