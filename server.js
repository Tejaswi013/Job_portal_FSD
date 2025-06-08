const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Avoid duplicate variable name conflict
const { setDb: setApplicationDb } = require('./models/application');
const { setDb: setUserDb } = require('./models/user');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const PORT = 5000;

// Serve uploaded files statically from /uploads URL path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('job_portal');

    // ✅ Initialize both application and user database models
    setApplicationDb(db);
    setUserDb(db);

    // ✅ Ensure 'uploads' directory exists
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // ✅ Load and mount routes
    const jobRoutes = require('./routes/jobs')(db);
    app.use('/api/jobs', jobRoutes);

    const authRoutes = require('./routes/auth')(db);
    app.use('/api/auth', authRoutes);

    const applicationsRoutes = require('./routes/applications')(db);
    app.use('/api/applications', applicationsRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
  }
}

connectDB();
