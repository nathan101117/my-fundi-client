import React, { useEffect, useState } from "react";
import axios from "axios";
import { ARTISAN_TYPES } from "../utils/constants";
import { useNavigate } from "react-router-dom";

function HireArtisan() {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    craft: "",
    location: "",
    minRating: 0,
    maxPrice: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
  });

  const navigate = useNavigate();

  // ✅ Restrict to Clients Only
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "client") {
      alert("Only clients can access this page.");
      navigate("/dashboard");
    }
  }, []);

  // ✅ Fetch Artisans
  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      const response = await axios.get("https://myfundi-server-93521f94d28e.herokuapp.com/api/artisans");
      setArtisans(response.data);
      setFilteredArtisans(response.data);
    } catch (error) {
      console.error("❌ Error fetching artisans:", error);
    }
  };

  // ✅ Apply filters
  useEffect(() => {
    const results = artisans.filter((artisan) => {
      const matchName = artisan.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCraft = filters.craft ? artisan.craft === filters.craft : true;
      const matchLocation = filters.location
        ? artisan.location?.toLowerCase().includes(filters.location.toLowerCase())
        : true;
      const avgRating = artisan.ratings?.numberOfRatings
        ? artisan.ratings.totalRating / artisan.ratings.numberOfRatings
        : 0;
      const matchRating = avgRating >= parseFloat(filters.minRating || 0);
      const matchPrice = filters.maxPrice
       ? artisan.standardRate <= parseInt(filters.maxPrice)
      : true;

      return matchName && matchCraft && matchLocation && matchRating && matchPrice;
    });

    setFilteredArtisans(results);
  }, [searchQuery, filters, artisans]);

  // ✅ Open modal to send job offer
  const openHireForm = (artisan) => {
    setSelectedArtisan(artisan);
    setShowForm(true);
  };

  const handleJobInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit hire form
  const submitHireForm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in.");

      const jobDetails = {
        ...jobForm,
        artisanId: selectedArtisan._id,
        status: "Pending Acceptance", // Offer system
      };

      await axios.post("https://myfundi-server-93521f94d28e.herokuapp.com/api/jobs/hire", jobDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`✅ Offer sent to ${selectedArtisan.name}`);
      setShowForm(false);
      setJobForm({ title: "", description: "", budget: "", location: "" });
    } catch (error) {
      console.error("❌ Error sending offer:", error);
      alert("Failed to send offer.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Hire an Artisan</h2>

      {/* 🔍 Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Search by name..."
            className="form-control"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            onChange={(e) => setFilters({ ...filters, craft: e.target.value })}
          >
            <option value="">All Crafts</option>
            {ARTISAN_TYPES.map((craft) => (
              <option key={craft} value={craft}>{craft}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            placeholder="Location"
            className="form-control"
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            placeholder="Min Rating"
            className="form-control"
            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Max Price"
            className="form-control"
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* 🧑‍🔧 Artisan List */}
      <div className="row">
        {filteredArtisans.length === 0 ? (
          <p className="text-center">No artisans found.</p>
        ) : (
          filteredArtisans.map((artisan) => {
            const avgRating = artisan.ratings?.numberOfRatings
              ? (artisan.ratings.totalRating / artisan.ratings.numberOfRatings).toFixed(1)
              : "N/A";

            return (
              <div key={artisan._id} className="col-md-4 mb-4">
                <div className="card p-3 shadow-sm">
                  <h5>{artisan.name}</h5>
                  <p><strong>Craft:</strong> {artisan.craft}</p>
                  <p><strong>Location:</strong> {artisan.location}</p>
                  <p><strong>Rating:</strong> {avgRating}</p>
                  <p><strong>Consultation Fee:</strong> KES {artisan.consultationFee || "N/A"}</p>
                  <p><strong>Daily Rate:</strong> KES {artisan.standardRate || "N/A"}</p>

                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={() => navigate(`/artisan/${artisan._id}`)}>
                      View Profile
                    </button>
                    <button className="btn btn-success" onClick={() => openHireForm(artisan)}>
                      Hire
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✍️ Modal to Send Offer */}
      {showForm && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hire {selectedArtisan.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  name="title"
                  placeholder="Job Title"
                  value={jobForm.title}
                  onChange={handleJobInputChange}
                  required
                />
                <textarea
                  className="form-control mb-2"
                  name="description"
                  placeholder="Job Description"
                  value={jobForm.description}
                  onChange={handleJobInputChange}
                  required
                ></textarea>
                <input
                  className="form-control mb-2"
                  name="budget"
                  type="number"
                  placeholder="Budget (KES)"
                  value={jobForm.budget}
                  onChange={handleJobInputChange}
                  required
                />
                <input
                  className="form-control mb-2"
                  name="location"
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={handleJobInputChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-success" onClick={submitHireForm}>Send Offer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HireArtisan;
