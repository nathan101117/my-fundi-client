import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ArtisanOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://myfundi-server-93521f94d28e.herokuapp.com/api/jobs/offers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(response.data);
    } catch (error) {
      console.error("❌ Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAccept = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://myfundi-server-93521f94d28e.herokuapp.com/api/jobs/accept-offer/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Offer accepted!");
      fetchOffers();
    } catch (error) {
      console.error("❌ Error accepting offer:", error);
      alert("Failed to accept offer.");
    }
  };

  const handleReject = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://myfundi-server-93521f94d28e.herokuapp.com/api/jobs/reject-offer/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("❌ Offer rejected.");
      fetchOffers();
    } catch (error) {
      console.error("❌ Error rejecting offer:", error);
      alert("Failed to reject offer.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading offers...</p>;

  return (
    <div className="container mt-4">
      <h2>Job Offers</h2>

      {offers.length === 0 ? (
        <p>No pending job offers.</p>
      ) : (
        offers.map((offer) => (
          <div key={offer._id} className="card p-3 mb-3 shadow-sm">
            <h5>{offer.title}</h5>
            <p><strong>Description:</strong> {offer.description}</p>
            <p><strong>Budget:</strong> KES {offer.budget}</p>
            <p><strong>Location:</strong> {offer.location}</p>
            <p><strong>Status:</strong> {offer.status}</p>

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-success" onClick={() => handleAccept(offer._id)}>
                Accept
              </button>
              <button className="btn btn-danger" onClick={() => handleReject(offer._id)}>
                Reject
              </button>

              {/* ✅ View Client Reviews Button */}
              {offer.clientId && (
                <Link
                  to={`/client-reviews/${offer.clientId}`}
                  className="btn btn-outline-primary"
                >
                  View Client Reviews
                </Link>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ArtisanOffers;
