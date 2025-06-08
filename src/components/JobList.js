import React, { useEffect, useState } from 'react';

function JobList({ refresh }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [applicant, setApplicant] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refresh]);

  const handleApplyClick = (jobId) => {
    setApplyingJobId(jobId);
    setApplicant({ name: '', email: '', phone: '', resume: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicant((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setApplicant((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!applicant.name || !applicant.email) {
      alert('Name and email are required!');
      return;
    }

    const formData = new FormData();
    formData.append('name', applicant.name);
    formData.append('email', applicant.email);
    formData.append('phone', applicant.phone);
    formData.append('jobId', applyingJobId);
    if (applicant.resume) {
      formData.append('resume', applicant.resume);
    }

    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Application submitted successfully!');
        setApplyingJobId(null);
      } else {
        const errorData = await res.json();
        alert('Failed to submit application: ' + errorData.message);
      }
    } catch (err) {
      alert('Error submitting application');
      console.error(err);
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="job-list">
      <h2>Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id} className="job-item">
              <div>
                <span className="job-title">{job.title}</span>{' '}
                <span className="job-company">— {job.company}</span>
              </div>
              <p className="job-description">{job.description}</p>

              <button onClick={() => handleApplyClick(job._id)}>Apply</button>

              {applyingJobId === job._id && (
                <form onSubmit={handleSubmit} className="application-form">
                  <input
                    type="text"
                    name="name"
                    value={applicant.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={applicant.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={applicant.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone"
                  />
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  {applicant.resume && <p>Selected file: {applicant.resume.name}</p>}

                  <button type="submit">Submit Application</button>
                  <button type="button" onClick={() => setApplyingJobId(null)}>
                    Cancel
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;

