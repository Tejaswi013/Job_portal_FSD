import React, { useState } from 'react';

function RecruiterLogin({ setPage }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login/recruiter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      // Save user role to localStorage
      localStorage.setItem('userRole', 'recruiter'); // or use data.role if your backend sends it
      setMessage('Login successful!');
      setPage('home');
    } else {
      setMessage(data.message || 'Login failed');
    }
  };

  

  return (
    <div>
      <h2>Recruiter Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RecruiterLogin;
