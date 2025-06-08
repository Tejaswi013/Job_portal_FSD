const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  getRecruitersCollection,
  getApplicantsCollection,
} = require('../models/user');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Use dotenv in production

module.exports = (db) => {
  const recruiters = getRecruitersCollection(db);
  const applicants = getApplicantsCollection(db);

  // Register recruiter
  router.post('/register/recruiter', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await recruiters.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Recruiter already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await recruiters.insertOne({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Recruiter registered', id: result.insertedId });
  });

  // Register applicant
  router.post('/register/applicant', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await applicants.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Applicant already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await applicants.insertOne({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Applicant registered', id: result.insertedId });
  });

  // Login recruiter
  router.post('/login/recruiter', async (req, res) => {
    const { email, password } = req.body;
    const user = await recruiters.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: 'recruiter' }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: 'recruiter' });
  });

  // Login applicant
  router.post('/login/applicant', async (req, res) => {
    const { email, password } = req.body;
    const user = await applicants.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: 'applicant' }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: 'applicant' });
  });

  return router;
};