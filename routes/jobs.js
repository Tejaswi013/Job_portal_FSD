// backend/routes/jobs.js

const express = require('express');
const router = express.Router();
const { getJobsCollection, ObjectId } = require('../models/job'); 


module.exports = (db) => {
  const jobsCollection = getJobsCollection(db);

  // GET all jobs
  router.get('/', async (req, res) => {
    const jobs = await jobsCollection.find({}).toArray();
    res.json(jobs);
  });

  // POST a new job
  router.post('/', async (req, res) => {
    const { title, company, description } = req.body;
    const result = await jobsCollection.insertOne({ title, company, description });
    res.json(result);
  });

  // DELETE a job
  router.delete('/:id', async (req, res) => {
    const jobId = req.params.id;
    const result = await jobsCollection.deleteOne({ _id: new ObjectId(jobId) });
    res.json(result);
  });

  return router;
};
