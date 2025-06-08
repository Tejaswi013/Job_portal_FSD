let dbInstance = null;

function setDb(db) {
  dbInstance = db;
}

function getApplicationsCollection() {
  if (!dbInstance) throw new Error('Database not initialized');
  return dbInstance.collection('applications');
}

module.exports = { setDb, getApplicationsCollection };
