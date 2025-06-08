import './App.css';
import React, { useState } from 'react';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import RecruiterRegister from './components/RecruiterRegister';
import RecruiterLogin from './components/RecruiterLogin';
import ApplicantRegister from './components/ApplicantRegister';
import ApplicantLogin from './components/ApplicantLogin';

function App() {
  const [refreshJobs, setRefreshJobs] = useState(false);
  const [page, setPage] = useState('home');

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole'); // 'recruiter' or 'applicant' or null

  const handleJobAdded = () => {
    setRefreshJobs(!refreshJobs);
  };

  const renderPage = () => {
    switch (page) {
      case 'recruiterRegister': 
        return <RecruiterRegister />;
      case 'recruiterLogin': return <RecruiterLogin setPage={setPage} />;
      case 'applicantRegister': 
        return <ApplicantRegister />;
      case 'applicantLogin': return <ApplicantLogin setPage={setPage} />;
      case 'home': 
      default:
        if (userRole === 'recruiter') {
          // Show add new job form to recruiters
          return <JobForm onJobAdded={handleJobAdded} />;
        } else if (userRole === 'applicant') {
          // Show all job postings to applicants
          return <JobList refresh={refreshJobs} />;
        } else {
          // Not logged in or unknown role - show both or a message
          return (
            <>
              <p>Please login to see job postings or add a job.</p>
              {/* Optionally show both or nothing */}
              {/* <JobForm onJobAdded={handleJobAdded} /> */}
              {/* <JobList refresh={refreshJobs} /> */}
            </>
          );
        }
    }
  };

  return (
    <div className="App">
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('recruiterRegister')}>Recruiter Register</button>
        <button onClick={() => setPage('recruiterLogin')}>Recruiter Login</button>
        <button onClick={() => setPage('applicantRegister')}>Applicant Register</button>
        <button onClick={() => setPage('applicantLogin')}>Applicant Login</button>
      </nav>

      {renderPage()}
    </div>
  );
}

export default App;
