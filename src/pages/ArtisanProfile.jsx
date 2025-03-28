import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ArtisanProfile() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/artisans/${id}`);
        setArtisan(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching artisan profile:", error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("❌ Error fetching reviews:", err);
      }
    };

    fetchArtisan();
    fetchReviews();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHireForm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in.");

      const jobDetails = {
        ...jobForm,
        artisanId: artisan._id,
        status: "Pending Acceptance",
      };

      await axios.post("http://localhost:5000/api/jobs/hire", jobDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`✅ Offer sent to ${artisan.name}`);
      setShowForm(false);
      setJobForm({ title: "", description: "", budget: "", location: "" });
    } catch (error) {
      console.error("❌ Error sending offer:", error);
      alert("Failed to send offer.");
    }
  };

  const avgRating = artisan?.ratings?.numberOfRatings
    ? (artisan.ratings.totalRating / artisan.ratings.numberOfRatings).toFixed(1)
    : "N/A";

  if (loading) return <p className="text-center mt-5">Loading artisan profile...</p>;
  if (!artisan) return <p className="text-center text-danger mt-5">Artisan not found.</p>;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2>{artisan.name}</h2>
        <p><strong>Email:</strong> {artisan.email}</p>
        <p><strong>Phone:</strong> {artisan.phoneNumber}</p>
        <p><strong>Location:</strong> {artisan.location}</p>
        <p><strong>Craft:</strong> {artisan.craft}</p>
        <p><strong>Description:</strong> {artisan.description || "No bio provided."}</p>
        <p><strong>Rating:</strong> {avgRating}</p>
        <p><strong>Consultation Fee:</strong> KES {artisan.consultationFee || "N/A"}</p>
        <p><strong>Standard Daily Rate:</strong> KES {artisan.standardRate || "N/A"}</p>

        <button className="btn btn-success mt-3" onClick={() => setShowForm(true)}>
          Hire this Artisan
        </button>
      </div>

      {/* ⭐ REVIEWS */}
      <div className="card p-4 shadow mt-4">
        <h4>⭐ Reviews</h4>
        {reviews.length === 0 ? (
          <p>This artisan has no reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-bottom py-2">
              <strong>{review.reviewer?.name || "Anonymous"}</strong>{" "}
              <span className="text-warning">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              <p className="mb-1">{review.comment || "No comment."}</p>
              <small className="text-muted">{new Date(review.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hire {artisan.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  name="title"
                  placeholder="Job Title"
                  value={jobForm.title}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  className="form-control mb-2"
                  name="description"
                  placeholder="Job Description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <input
                  className="form-control mb-2"
                  name="budget"
                  type="number"
                  placeholder="Budget (KES)"
                  value={jobForm.budget}
                  onChange={handleInputChange}
                  required
                />
                <input
                  className="form-control mb-2"
                  name="location"
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={handleInputChange}
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

export default ArtisanProfile;
