import React, { useState } from "react";
import axios from "axios";

function TopUp() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleTopUp = async (e) => {
    e.preventDefault();  // Prevent form submission refresh
  
    const token = localStorage.getItem("token");  // Get the token from localStorage
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const topUpAmount = parseFloat(amount);  // Use the state variable directly
  
      // Send request with token in the Authorization header
      const res = await axios.put(
        `https://myfundi-server-93521f94d28e.herokuapp.com/api/wallet/${user.id}/topup`,
        { amount: topUpAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the token in the header
          }
        }
      );
  
      if (res.data.success) {
        alert("Top-up successful!");
        // Update state or redirect if necessary
      }
    } catch (err) {
      console.error("Failed to top up:", err);
      alert("Failed to top up. Please try again.");
    }
  };
  
  
  return (
    <div className="container mt-5">
      <h2>💳 Wallet Top-Up</h2>
      <form onSubmit={handleTopUp} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Enter Amount (KES)</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </div>
        <button className="btn btn-success" type="submit">Top Up</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
}

export default TopUp;
