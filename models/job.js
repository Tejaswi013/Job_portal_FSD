// backend/models/Job.js

const { ObjectId } = require('mongodb');

function getJobsCollection(db) {
  return db.collection('jobs');
}

module.exports = { getJobsCollection, ObjectId };
