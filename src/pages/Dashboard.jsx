import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ReviewModal from "./ReviewModal";
import PayNowModal from "./PayNowModal";

function Dashboard() {
  const navigate = useNavigate();

  // ======= State =======
  const [user, setUser] = useState(null);

  // Shared or client
  const [clientJobs, setClientJobs] = useState([]);
  const [clientCompleted, setClientCompleted] = useState([]);
  const [clientPaidJobs, setClientPaidJobs] = useState([]);  // Added paid jobs state

  // Artisan
  const [artisanOngoing, setArtisanOngoing] = useState([]);    // from /jobs/artisan-jobs
  const [artisanCompleted, setArtisanCompleted] = useState([]); // from /jobs/artisan-completed
  const [artisanPaidJobs, setArtisanPaidJobs] = useState([]);  // Added paid jobs state for artisan
  const [appliedJobs, setAppliedJobs] = useState([]);          // from /applications/artisan/:artisanId

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // { jobId, revieweeId }

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedJobForPayment, setSelectedJobForPayment] = useState(null);

  // ======= On Mount: Check user & token =======
  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!token || !loggedInUser) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    setUser(loggedInUser);
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!token || !loggedInUser) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    setUser(loggedInUser);
  }, [navigate]);

  // ======= On user set: fetch data based on role =======
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");

    if (user.role === "client") {
      fetchClientJobs(token);          // For fetching client jobs
      fetchClientCompleted(token);     // For fetching client completed jobs
      fetchClientPaidJobs(token);      // For fetching client paid jobs
    } else if (user.role === "artisan") {
      // Artisan-specific jobs
      fetchArtisanOngoing(token);
      fetchArtisanCompleted(token);
      fetchArtisanPaidJobs(token);    // Fetch artisan paid jobs
      fetchArtisanApplied(token);     // Fetch artisan applied jobs
    }
  }, [user]);

  // ======= Client fetches =======
  const fetchClientJobs = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/client-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientJobs(res.data); // All jobs posted by this client
    } catch (error) {
      console.error("❌ Error fetching client jobs:", error);
    }
  };

  const fetchClientCompleted = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/client-completed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientCompleted(res.data);  // Make sure to set 'clientCompleted'
    } catch (error) {
      console.error("❌ Error fetching client completed jobs:", error);
    }
  };

  const fetchClientPaidJobs = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/client-paid", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientPaidJobs(res.data);
    } catch (error) {
      console.error("❌ Error fetching client paid jobs:", error);
    }
  };

  // ======= Artisan fetches =======
  const fetchArtisanOngoing = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/artisan-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtisanOngoing(res.data); // In Progress jobs for artisan
    } catch (error) {
      console.error("❌ Error fetching artisan ongoing jobs:", error);
    }
  };

  const fetchArtisanCompleted = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/artisan-completed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtisanCompleted(res.data); // Completed jobs for artisan
    } catch (error) {
      console.error("❌ Error fetching artisan completed jobs:", error);
    }
  };

  const fetchArtisanPaidJobs = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/artisan-paid", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtisanPaidJobs(res.data); // Update the state with the paid jobs data
    } catch (error) {
      console.error("❌ Error fetching artisan paid jobs:", error);
    }
  };

  const fetchArtisanApplied = async (token) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/applications/artisan/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const appliedJobObjects = res.data
        .map((app) => app.jobId)
        .filter(Boolean);
      setAppliedJobs(appliedJobObjects);
    } catch (error) {
      console.error("❌ Error fetching artisan applied jobs:", error);
    }
  };

  // ======= Payment success callback =======
  const handlePaymentSuccess = () => {
    const token = localStorage.getItem("token");
    fetchClientCompleted(token);
    fetchClientPaidJobs(token);  // Refresh paid jobs as well
  };

  // ======= Handle Review Modal =======
  const openReviewModal = (jobId, revieweeId) => {
    setReviewTarget({ jobId, revieweeId });
    setShowReviewModal(true);
  };

  // ======= Handle PayNow Modal =======
  const openPayNowModal = (job) => {
    setSelectedJobForPayment(job);
    setShowPayModal(true);
  };

  // ======= Render for CLIENT =======
  const renderClientView = () => {
    const openJobs = clientJobs.filter((job) => job.status === "Open");
    const inProgressJobs = clientJobs.filter((job) => job.status === "In Progress");

    return (
      <>
        {/* Open Jobs */}
        <div className="card p-4 shadow mb-4">
          <h3>📌 Open Jobs</h3>
          {openJobs.length === 0 ? (
            <p>No open jobs yet.</p>
          ) : (
            openJobs.map((job) => (
              <div key={job._id} className="border p-3 mb-3">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Budget:</strong> KES {job.budget}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <button
                  className="btn btn-outline-success mt-2"
                  onClick={() => updateJobStatus(job._id, "In Progress")}
                >
                  Mark as In Progress
                </button>
              </div>
            ))
          )}
        </div>

        {/* Completed Jobs */}
        <div className="card p-4 shadow mb-4">
          <h3>✅ Completed Jobs</h3>
          {clientCompleted.length === 0 ? (
            <p>No completed jobs yet.</p>
          ) : (
            clientCompleted.map((job) => (
              <div key={job._id} className="border p-3 mb-3">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Budget:</strong> KES {job.budget}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-success"
                    onClick={() => openPayNowModal(job)}
                  >
                    💳 Pay Now
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => openReviewModal(job._id, job.assignedArtisan)}
                  >
                    Leave a Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paid Jobs */}
        <div className="card p-4 shadow mb-4">
          <h3>💰 Paid Jobs</h3>
          {clientPaidJobs.length === 0 ? (
            <p>No paid jobs yet.</p>
          ) : (
            clientPaidJobs.map((job) => (
              <div key={job._id} className="border p-3 mb-3">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Budget:</strong> KES {job.budget}</p>
                <p><strong>Status:</strong> Paid</p>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => openReviewModal(job._id, job.assignedArtisan)}
                  >
                    Leave a Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  };

  // ======= Render for ARTISAN =======
  const renderArtisanView = () => {
    return (
      <>
        {/* Ongoing Jobs */}
        <div className="card p-4 shadow mb-4">
          <h3>🔧 Ongoing Jobs</h3>
          {artisanOngoing.length === 0 ? (
            <p>No ongoing jobs.</p>
          ) : (
            artisanOngoing.map((job) => (
              <div key={job._id} className="border p-3 mb-3">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Budget:</strong> KES {job.budget}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <button
                  className="btn btn-outline-success mt-2"
                  onClick={() => completeArtisanJob(job._id)}
                >
                  Mark as Completed
                </button>
              </div>
            ))
          )}
        </div>

        {/* Completed Jobs */}
        <div className="card p-4 shadow mb-4">
          <h3>✅ Completed Jobs</h3>
          {artisanCompleted.length === 0 ? (
            <p>No completed jobs.</p>
          ) : (
            artisanCompleted.map((job) => (
              <div key={job._id} className="border p-3 mb-3">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Budget:</strong> KES {job.budget}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={() => openReviewModal(job._id, job.clientId)}
                >
                  Leave a Review
                </button>
              </div>
            ))
          )}
        </div>

        {/* Paid Jobs */}
        <div className="card p-4 shadow mb-4">
          <h3>💰 Paid Jobs</h3>
          {artisanPaidJobs.length === 0 ? (
            <p>No paid jobs yet.</p>
          ) : (
            artisanPaidJobs.map((job) => (
              <div key={job._id} className="border p-3 mb-3">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Budget:</strong> KES {job.budget}</p>
                <p><strong>Status:</strong> Paid</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => openReviewModal(job._id, job.clientId)}
                >
                  Leave a Review
                </button>
              </div>
            ))
          )}
        </div>

        {/* Applied Jobs */}
        <div className="card p-4 shadow mb-4">
          <h3>📩 Jobs Applied For</h3>
          {appliedJobs.length === 0 ? (
            <p>You haven't applied for any jobs yet.</p>
          ) : (
            appliedJobs.map((job) => (
              <div key={job._id} className="border p-3 mb-3">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Budget:</strong> KES {job.budget}</p>
                <p><strong>Status:</strong> {job.status}</p>
              </div>
            ))
          )}
        </div>
      </>
    );
  };

  // ======= Helpers =======
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/jobs/update/${jobId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh client jobs after update
      if (user.role === "client") {
        fetchJobs(user, token);
        fetchClientCompleted(token);
      }
    } catch (error) {
      console.error("❌ Error updating job status:", error);
      alert("Error updating job status.");
    }
  };

  const completeArtisanJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      // Mark job as completed
      await axios.put(
        `http://localhost:5000/api/jobs/update/${jobId}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh artisan jobs
      fetchArtisanOngoing(token);
      fetchArtisanCompleted(token);
    } catch (error) {
      console.error("❌ Error marking job as completed:", error);
      alert("Error marking job as completed.");
    }
  };

  // ======= Return =======
  if (!user) {
    return null; // or a spinner
  }

  return (
    <div className="container mt-5">
      <h1>Welcome, {user.name}!</h1>
      <h3>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</h3>

      {user.role === "client" && renderClientView()}
      {user.role === "artisan" && renderArtisanView()}

      {/* Review Modal */}
      {showReviewModal && reviewTarget && (
        <ReviewModal
          show={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          jobId={reviewTarget.jobId}
          revieweeId={reviewTarget.revieweeId}
          reviewerId={user._id}
          role={user.role}
          onReviewSubmitted={() => setShowReviewModal(false)}
        />
      )}

      {/* Pay Now Modal */}
      {showPayModal && selectedJobForPayment && (
        <PayNowModal
          show={showPayModal}
          onClose={() => setShowPayModal(false)}
          job={selectedJobForPayment}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;
