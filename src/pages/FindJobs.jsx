import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function FindJobs() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [relevantJobs, setRelevantJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!token || !loggedInUser || loggedInUser.role !== "artisan") {
      alert("Only artisans can access this page.");
      return;
    }

    setUser(loggedInUser);
    fetchJobs(loggedInUser, token);
    fetchAppliedJobs(token);
  }, []);

  const fetchJobs = (loggedInUser, token) => {
    axios
      .get("https://myfundi-server-93521f94d28e.herokuapp.com/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setJobs(res.data);

        const filtered = res.data.filter(
          (job) =>
            job.artisanType?.toLowerCase() ===
            loggedInUser.craft?.toLowerCase()
        );
        setRelevantJobs(filtered);
      })
      .catch((err) => {
        console.error("❌ Error fetching jobs:", err);
        alert("Failed to fetch jobs. Please log in again.");
      });
  };

  const fetchAppliedJobs = async (token) => {
    try {
      const res = await axios.get("https://myfundi-server-93521f94d28e.herokuapp.com/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appliedIds = new Set(
        res.data.map((application) => application.jobId._id)
      );
      setAppliedJobs(appliedIds);
    } catch (err) {
      console.error("❌ Error fetching applied jobs:", err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://myfundi-server-93521f94d28e.herokuapp.com/api/applications/apply",
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedJobs(new Set([...appliedJobs, jobId]));
      alert("✅ Application submitted successfully!");
    } catch (err) {
      console.error("❌ Error applying for job:", err);
      alert("Failed to apply for job.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Find Jobs</h1>

      {/* 🔍 All Available Jobs */}
      <div className="card p-4 shadow mb-4">
        <h3>🔍 All Available Jobs</h3>
        {jobs.length === 0 ? (
          <p>No jobs available yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="border p-3 mb-3">
              <h5>{job.title}</h5>
              <p>{job.description}</p>
              <p><strong>Budget:</strong> KES {job.budget}</p>
              <p><strong>Artisan Required:</strong> {job.artisanType}</p>
              <p><strong>Status:</strong> {job.status}</p>

              {appliedJobs.has(job._id) ? (
                <button className="btn btn-secondary" disabled>Already Applied</button>
              ) : job.status === "Open" ? (
                <button className="btn btn-success me-2" onClick={() => handleApply(job._id)}>Apply Now</button>
              ) : (
                <button className="btn btn-secondary" disabled>Closed</button>
              )}

              {/* ✅ View Client Reviews */}
              {job.clientId && (
                <Link
                  to={`/client-reviews/${job.clientId}`}
                  className="btn btn-outline-primary ms-2"
                >
                  View Client Reviews
                </Link>
              )}
            </div>
          ))
        )}
      </div>

      {/* 🎯 Jobs Matching Your Craft */}
      <div className="card p-4 shadow">
        <h3>🎯 Jobs for You</h3>
        {relevantJobs.length === 0 ? (
          <p>No relevant jobs found.</p>
        ) : (
          relevantJobs.map((job) => (
            <div key={job._id} className="border p-3 mb-3">
              <h5>{job.title}</h5>
              <p>{job.description}</p>
              <p><strong>Budget:</strong> KES {job.budget}</p>
              <p><strong>Artisan Required:</strong> {job.artisanType}</p>
              <p><strong>Status:</strong> {job.status}</p>

              {appliedJobs.has(job._id) ? (
                <button className="btn btn-secondary" disabled>Already Applied</button>
              ) : job.status === "Open" ? (
                <button className="btn btn-success me-2" onClick={() => handleApply(job._id)}>Apply Now</button>
              ) : (
                <button className="btn btn-secondary" disabled>Closed</button>
              )}

              {/* ✅ View Client Reviews */}
              {job.clientId && (
                <Link
                  to={`/client-reviews/${job.clientId}`}
                  className="btn btn-outline-primary ms-2"
                >
                  View Client Reviews
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FindJobs;
