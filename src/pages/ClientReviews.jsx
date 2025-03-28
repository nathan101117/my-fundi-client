// src/pages/ClientReviews.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ClientReviews() {
  const { clientId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${clientId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("❌ Error fetching reviews:", err);
      }
    };

    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${clientId}`);
        setClient(res.data);
      } catch (err) {
        console.error("❌ Error fetching client:", err);
      }
    };

    fetchClient();
    fetchReviews();
    setLoading(false);
  }, [clientId]);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="container mt-5">
      <h2>🧾 Client Reviews</h2>
      {client && <h4>For: {client.name}</h4>}

      {reviews.length === 0 ? (
        <p>No reviews for this client yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border rounded p-3 mb-3">
            <strong>Reviewer:</strong> {review.reviewer?.name || "Anonymous"} <br />
            <strong>Rating:</strong>{" "}
            {"★".repeat(review.rating)}{" "}
            {"☆".repeat(5 - review.rating)} <br />
            {review.comment && (
              <p className="mt-2 mb-0"><em>"{review.comment}"</em></p>
            )}
            <small className="text-muted">
              {new Date(review.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}

      <Link to="/dashboard" className="btn btn-secondary mt-3">← Back to Dashboard</Link>
    </div>
  );
}

export default ClientReviews;
