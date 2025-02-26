// backend/models/Document.js
const mongoose = require('mongoose');

const RevisionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const DocumentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  revisions: [RevisionSchema]
});

module.exports = mongoose.model('Document', DocumentSchema);