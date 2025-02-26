require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const setupAuth = require('./auth'); // Import Oauth module
const Document = require('./models/Document');

const app = express();

// Middleware
// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Configure sessions
app.use(session({ 
  secret: 'your_secret_key', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax' //Works well for local dev
  }
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Set up authentication routes from our auth module
setupAuth(app);


// GET /document/revisions - Retrieve revision history
app.get('/document/revisions', async (req, res) => {
  try {
    let doc = await Document.findOne({});
    if (!doc) {
      return res.json({ revisions: [] });
    }
    res.json({ revisions: doc.revisions });
  } catch (err) {
    console.error('Error fetching revisions:', err);
    res.status(500).json({ error: 'Error fetching revisions' });
  }
});

// POST /document
app.post('/document', async (req, res) => {
  try {
    const { document } = req.body;
    let doc = await Document.findOne({});
    if (!doc) {
      // Create a new document if none exists
      doc = await Document.create({ content: document, revisions: [] });
    } else {
      // Save the current content as a revision
      doc.revisions.push({
        content: doc.content,
        updatedAt: doc.updatedAt
      });
      // Update with the new content and timestamp
      doc.content = document;
      doc.updatedAt = Date.now();
      await doc.save();
    }
    res.json({ message: 'Document updated', document: doc.content });
  } catch (err) {
    console.error('Error updating document:', err);
    res.status(500).json({ error: 'Error updating document' });
  }
});

mongoose.connect('mongodb://localhost:27017/docsplatform', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/test', (req, res) => res.send('Test route works!'));

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
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

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