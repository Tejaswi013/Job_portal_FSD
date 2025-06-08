let dbInstance = null;

function setDb(db) {
  dbInstance = db;
}

function getRecruitersCollection() {
  if (!dbInstance) throw new Error('Database not initialized');
  return dbInstance.collection('recruiters');
}

function getApplicantsCollection() {
  if (!dbInstance) throw new Error('Database not initialized');
  return dbInstance.collection('applicants');
}

module.exports = {
  setDb,
  getRecruitersCollection,
  getApplicantsCollection,
};
