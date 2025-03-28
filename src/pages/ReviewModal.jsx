import React, { useState } from "react";
import axios from "axios";
import "../styles/ReviewModal.css"; // Optional: for custom styling

function ReviewModal({ show, onClose, jobId, revieweeId, reviewerId, role, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          jobId,
          reviewee: revieweeId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Review submitted!");
      onReviewSubmitted(); // callback to close modal and refresh
    } catch (error) {
      alert("❌ Error submitting review");
      console.error(error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content shadow-lg">
        <h5 className="mb-3">Leave a Review ({role === "client" ? "Artisan" : "Client"})</h5>

        <div className="mb-3">
          <label className="form-label">Rating:</label>
          <div>
            {[1, 2, 3, 4, 5].map((val) => (
              <span
                key={val}
                className={`star ${val <= rating ? "filled" : ""}`}
                onClick={() => handleStarClick(val)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Comment:</label>
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={rating === 0}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
