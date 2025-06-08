import React, { useEffect, useState } from 'react';

function ApplicantList() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Submitted Applications</h2>
      {applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        <ul>
          {applications.map(app => (
            <li key={app._id}>
              <p><strong>Name:</strong> {app.name}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Phone:</strong> {app.phone}</p>
              <p><strong>Job ID:</strong> {app.jobId}</p>
              {app.resumeUrl && (
                <p>
                  <a href={`http://localhost:5000${app.resumeUrl}`} target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                </p>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ApplicantList;
