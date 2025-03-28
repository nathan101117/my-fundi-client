import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(res.data);
      } catch (err) {
        console.error("❌ Error fetching applicants:", err);
      }
    };

    const fetchJob = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobTitle(res.data.title);
      } catch (err) {
        console.error("❌ Error fetching job info:", err);
      }
    };

    fetchApplicants();
    fetchJob();
  }, [jobId]);

  const handleAccept = async (artisanId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/jobs/accept-applicant/${jobId}/${artisanId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Applicant accepted");
    } catch (err) {
      console.error("❌ Error accepting applicant:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>👷 Applicants for: {jobTitle}</h3>

      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        applicants.map((app) => (
          <div key={app._id} className="card p-3 mb-3 shadow-sm">
            <p><strong>Name:</strong> {app.artisanId.name}</p>
            <p><strong>Craft:</strong> {app.artisanId.craft}</p>
            <p><strong>Location:</strong> {app.artisanId.location}</p>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={() => handleAccept(app.artisanId._id)}>
                Accept
              </button>
              <Link to={`/artisan/${app.artisanId._id}`} className="btn btn-outline-primary">
                View Profile
              </Link>
            </div>
          </div>
        ))
      )}

      <Link to="/dashboard" className="btn btn-secondary mt-3">← Back to Dashboard</Link>
    </div>
  );
}

export default JobApplicants;
