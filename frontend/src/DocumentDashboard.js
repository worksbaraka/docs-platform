// frontend/src/DocumentDashboard.js
import React, { useState, useEffect } from 'react';

const DocumentDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents on component mount
  useEffect(() => {
    fetch('http://localhost:5000/documents')
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching documents:', err);
        setLoading(false);
      });
  }, []);

  // Delete a document by ID
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/documents/${id}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then(() => {
        // Remove deleted document from state
        setDocuments(documents.filter((doc) => doc._id !== id));
      })
      .catch((err) => console.error('Error deleting document:', err));
  };

  if (loading) {
    return <p>Loading documents...</p>;
  }

  return (
    <div>
      <h2>Document Dashboard</h2>
      {documents.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td>{new Date(doc.updatedAt).toLocaleString()}</td>
                <td>
                  {/* For now, we'll simply log the document ID on edit */}
                  <button onClick={() => console.log('Edit doc', doc._id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(doc._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DocumentDashboard;