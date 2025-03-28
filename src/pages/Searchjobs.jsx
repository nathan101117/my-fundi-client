import React, { useState, useEffect } from "react";

function SearchJobs() {
  const [jobs, setJobs] = useState([]);

  // Load jobs from localStorage when the page loads
  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
  }, []);

  return (
    <div className="container">
      <h2>Search Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="card mb-2">
            <div className="card-body">
              <h5>{job.title}</h5>
              <p><strong>Budget:</strong> KES {job.budget}</p>
              <p><strong>Status:</strong> {job.status}</p>
              
              {job.status === "Completed" ? (
                <button className="btn btn-secondary" disabled>Closed</button>
              ) : (
                <button className="btn btn-success">Apply Now</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchJobs;
