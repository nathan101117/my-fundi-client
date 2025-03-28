import React from "react";
import { useNavigate } from "react-router-dom";

function Hire() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2>Hire an Artisan</h2>
      <p>Choose whether to post a job and receive applications or hire an artisan directly.</p>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4>📝 Post a Job</h4>
            <p>Create a job listing and let artisans apply.</p>
            <button className="btn btn-primary" onClick={() => navigate("/post-job")}>
              Post a Job
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4>🔍 Find Artisans</h4>
            <p>Search for artisans and hire them directly.</p>
            <button className="btn btn-success" onClick={() => navigate("/hire-artisan")}>
              Find Artisans
            </button>
          </div>
        </div>
        <div className="col-md-6 mt-4">
          <div className="card p-4 shadow-sm">
            <h4>👥 View Applications</h4>
            <p>See all job applications from artisans.</p>
             <button className="btn btn-outline-primary" onClick={() => navigate("/job-applications")}>
               View Applications
             </button>
  </div>
</div>

      </div>
    </div>
  );
}

export default Hire;
