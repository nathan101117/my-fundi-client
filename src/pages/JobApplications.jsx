import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function JobApplications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/jobs/client-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("❌ Error fetching client jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientJobs();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📥 Job Applications</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="card p-3 mb-3 shadow-sm">
            <h5>{job.title}</h5>
            <p>{job.description}</p>
            <p><strong>Status:</strong> {job.status}</p>

            <Link
              to={`/job-applicants/${job._id}`}
              className="btn btn-outline-primary"
            >
              View Applicants
            </Link>
          </div>
        ))
      )}

      <Link to="/dashboard" className="btn btn-secondary mt-4">
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default JobApplications;
