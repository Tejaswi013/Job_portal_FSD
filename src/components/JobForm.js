import React, { useState } from 'react';

function JobForm({ onJobAdded }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, description }),
      });

      if (!res.ok) throw new Error('Failed to add job');

      await res.json();
      onJobAdded();
      setTitle('');
      setCompany('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <h2>Add a New Job</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Job title, e.g. Full Stack Developer"
      />

      <label htmlFor="company">Company</label>
      <input
        id="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
        placeholder="Company name, e.g. OpenAI"
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Brief description of the role"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Job'}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default JobForm;
