import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [transactions, setTransactions] = useState([]); // New state for transactions

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [userRes, jobRes, reviewRes, transactionRes] = await Promise.all([  // Added transaction fetch
        axios.get("https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/transactions", {  // Fetch transactions
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(userRes.data);
      setJobs(jobRes.data);
      setReviews(reviewRes.data);
      setTransactions(transactionRes.data);  // Set transactions
    } catch (err) {
      console.error("❌ Admin data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 USER ACTIONS
  const suspendUser = async (id) => {
    await axios.put(`https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/users/${id}/suspend`);
    fetchData();
  };

  const activateUser = async (id) => {
    await axios.put(`https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/users/${id}/activate`);
    fetchData();
  };

  const deleteUser = async (id) => {
    await axios.delete(`https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/users/${id}`);
    fetchData();
  };

  // 🔹 JOB ACTIONS
  const updateJobStatus = async (id, status) => {
    await axios.put(`https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/jobs/${id}/status`, { status });
    fetchData();
  };

  const deleteJob = async (id) => {
    await axios.delete(`https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/jobs/${id}`);
    fetchData();
  };

  // 🔹 REVIEW ACTIONS
  const flagReview = async (id) => {
    await axios.put(`https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/reviews/${id}/flag`);
    fetchData();
  };

  const deleteReview = async (id) => {
    await axios.delete(`https://myfundi-server-93521f94d28e.herokuapp.com/api/admin/reviews/${id}`);
    fetchData();
  };

   // 🔹 TRANSACTION ACTIONS
   const renderTransactions = () => {
    return transactions.map((transaction) => (
      <div key={transaction._id} className="border p-2 mb-2 d-flex justify-content-between align-items-center">
        <div>
          <strong>Transaction ID:</strong> {transaction._id}<br />
          <strong>Type:</strong> {transaction.transactionType}<br />
          <strong>Amount:</strong> KES {transaction.amount}<br />
          <strong>Balance Before:</strong> KES {transaction.balanceBefore}<br />
          <strong>Balance After:</strong> KES {transaction.balanceAfter}<br />
          <strong>Description:</strong> {transaction.description}
        </div>
        <div>
          <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mt-5">
      <h1>🛠️ Admin Dashboard</h1>

      {/* USERS */}
      <div className="card p-4 shadow mt-4">
        <h3>👥 All Users</h3>
        {users.map((u) => (
          <div key={u._id} className="border p-2 mb-2 d-flex justify-content-between align-items-center">
            <div>
              <strong>{u.name}</strong> - {u.email} ({u.role}) {u.isSuspended ? "🚫 Suspended" : ""}
            </div>
            <div>
              {u.isSuspended ? (
                <button onClick={() => activateUser(u._id)} className="btn btn-sm btn-success me-2">Activate</button>
              ) : (
                <button onClick={() => suspendUser(u._id)} className="btn btn-sm btn-warning me-2">Suspend</button>
              )}
              <button onClick={() => deleteUser(u._id)} className="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* JOBS */}
      <div className="card p-4 shadow mt-4">
        <h3>🧰 All Jobs</h3>
        {jobs.map((job) => (
          <div key={job._id} className="border p-2 mb-2 d-flex justify-content-between align-items-center">
            <div>
              <strong>{job.title}</strong> - {job.status}
            </div>
            <div>
              <button onClick={() => updateJobStatus(job._id, "Cancelled")} className="btn btn-sm btn-secondary me-2">Cancel</button>
              <button onClick={() => updateJobStatus(job._id, "Flagged")} className="btn btn-sm btn-warning me-2">Flag</button>
              <button onClick={() => deleteJob(job._id)} className="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* REVIEWS */}
      <div className="card p-4 shadow mt-4">
        <h3>⭐ All Reviews</h3>
        {reviews.map((r) => (
          <div key={r._id} className="border p-2 mb-2 d-flex justify-content-between align-items-center">
            <div>
              <strong>From:</strong> {r.reviewer?.name || "Unknown"}<br />
              <strong>To:</strong> {r.reviewee?.name || "Unknown"}<br />
              <strong>Rating:</strong> {r.rating}⭐ <br />
              <em>{r.comment}</em>
            </div>
            <div>
              <button onClick={() => flagReview(r._id)} className="btn btn-sm btn-warning me-2">Flag</button>
              <button onClick={() => deleteReview(r._id)} className="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* TRANSACTIONS */}
      <div className="card p-4 shadow mt-4">
        <h3>💳 All Transactions</h3>
        {renderTransactions()}
      </div>
    </div>
  );
}

export default AdminDashboard;
