import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ARTISAN_TYPES } from "../utils/constants";


function PostJob() {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: "",
    artisanType: "",
    location: "", // ✅ Ensure location is included
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("https://myfundi-server-93521f94d28e.herokuapp.com/api/jobs/post", jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Job posted successfully!");
      navigate("/dashboard"); // Redirect to dashboard after posting
    } catch (error) {
      console.error("❌ Error posting job:", error);
      alert("Failed to post job.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input type="text" name="title" className="form-control" onChange={handleChange} required />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows="3" onChange={handleChange} required></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Budget (KES)</label>
          <input type="number" name="budget" className="form-control" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Artisan Type</label>
          <select name="artisanType" className="form-select" onChange={handleChange} required>
          <option value="">Select Artisan Type</option>
           {ARTISAN_TYPES.map((craft) => (
          <option key={craft} value={craft}>{craft}</option>
          ))}
        </select>

        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
}

export default PostJob;
