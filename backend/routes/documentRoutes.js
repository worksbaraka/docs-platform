const express = require('express');
const Document = require('../models/Document');

const router = express.Router();

// GET /documents
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find({});
    res.json({ documents: docs });
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// POST /documents - new document
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const doc = await Document.create({ title, content, revisions: [] });
    res.json({ message: 'Document created', document: doc });
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ error: 'Error creating document' });
  }
});

// GET /documents/:id - Retrieve specific doc by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ document: doc });
  } catch (err) {
    console.error('Error fetching document:', err);
    res.status(500).json({ error: 'Error fetching document' });
  }
});

// PUT /documents/:id - Update a document (with revisioning)
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    // Save current content as a revision before updating
    doc.revisions.push({ content: doc.content, updatedAt: doc.updatedAt });
    // Update document fields
    if (title) doc.title = title;
    if (content) doc.content = content;
    doc.updatedAt = Date.now();
    await doc.save();
    res.json({ message: 'Document updated', document: doc });
  } catch (err) {
    console.error('Error updating document:', err);
    res.status(500).json({ error: 'Error updating document' });
  }
});

// DELETE /documents/:id - Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ error: 'Error deleting document' });
  }
});

// GET /documents/revisions - Retrieve revision history for a document
router.get('/:id/revisions', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ revisions: doc.revisions });
  } catch (err) {
    console.error('Error fetching revisions:', err);
    res.status(500).json({ error: 'Error fetching revisions' });
  }
});

module.exports = router;