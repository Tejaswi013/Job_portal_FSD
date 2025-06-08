const express = require('express');
const multer = require('multer');
const path = require('path');
const { getApplicationsCollection } = require('../models/application');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

module.exports = (db) => {
  const applicationsCollection = getApplicationsCollection(db);

  // POST new application with file upload
  router.post('/', upload.single('resume'), async (req, res) => {
    try {
      const { name, email, phone, jobId } = req.body;
      const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!name || !email || !jobId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const application = {
        name,
        email,
        phone,
        jobId,
        resumeUrl,
        appliedAt: new Date(),
      };

      const result = await applicationsCollection.insertOne(application);

      res.status(201).json({ message: 'Application submitted', applicationId: result.insertedId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // ✅ GET all applications
  router.get('/', async (req, res) => {
    try {
      const applications = await applicationsCollection.find().toArray();
      res.status(200).json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
