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

  const userRole = localStorage.getItem('userRole'); // 'recruiter' or 'applicant' or null

  const handleJobAdded = () => {
    setRefreshJobs(!refreshJobs);
  };

  const renderPage = () => {
    switch (page) {
      case 'recruiterRegister':
        return <RecruiterRegister />;
      case 'recruiterLogin':
        return <RecruiterLogin setPage={setPage} />;
      case 'applicantRegister':
        return <ApplicantRegister />;
      case 'applicantLogin':
        return <ApplicantLogin setPage={setPage} />;
      case 'home':
      default:
        if (userRole === 'recruiter') {
          return <JobForm onJobAdded={handleJobAdded} />;
        } else if (userRole === 'applicant') {
          return <JobList refresh={refreshJobs} />;
        } else {
          return (
            <div className="welcome-message">
              <p>Please login or register to view or add job postings.</p>
            </div>
          );
        }
    }
  };

  return (
    <div className="App">
      <nav className="nav-bar">
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('recruiterRegister')}>Recruiter Register</button>
        <button onClick={() => setPage('recruiterLogin')}>Recruiter Login</button>
        <button onClick={() => setPage('applicantRegister')}>Applicant Register</button>
        <button onClick={() => setPage('applicantLogin')}>Applicant Login</button>
      </nav>

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
