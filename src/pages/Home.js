import React from 'react';
import JobForm from './JobForm';
import JobList from './JobList';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';

function Home() {
  const userRole = localStorage.getItem('userRole');

  return (
    <div>
      {userRole === 'recruiter' && <JobForm />}
      {userRole === 'applicant' && <JobList />}
    </div>
  );
}

export default Home;
