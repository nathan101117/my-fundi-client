import React, { useEffect, useState } from "react";
import axios from "axios";

function PayNowModal({ show, onClose, job, onPaymentSuccess }) {
  const [artisan, setArtisan] = useState(null);
  const [daysWorked, setDaysWorked] = useState(1);
  const [agreedAmount, setAgreedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [artisanError, setArtisanError] = useState(false);  // Handle error
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (job?.assignedArtisan) {
      axios
        .get(`http://localhost:5000/api/artisans/${job.assignedArtisan}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setArtisan(res.data); // If the artisan is found, set it in the state
        })
        .catch((err) => {
          console.error("❌ Error fetching artisan:", err);
          setArtisan(null);  // Artisan not found
        });
    }
  }, [job]);  

  const handlePayment = async (e) => {
    e.preventDefault();
    console.log(`Sending payment of amount ${agreedAmount} for job ${job._id}`);
    try {
      setLoading(true);
      await axios.post(
        `http://localhost:5000/api/payments/pay/${job._id}`,  // Updated to the correct payment route
        { amount: parseFloat(agreedAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      alert("✅ Payment successful!");
      onPaymentSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Payment failed:", err.response ? err.response.data : err.message);
      alert("❌ Payment failed");
      setLoading(false);
    }
  };  

  if (!show || !job) return null;

  const suggestedAmount = artisan?.standardRate
    ? artisan.standardRate * daysWorked
    : job.budget;

  return (
    <div className="modal d-block" style={{ background: "#00000080" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h4 className="mb-3">💳 Pay Artisan</h4>
          <p><strong>Job:</strong> {job.title}</p>
          <p><strong>Budget:</strong> KES {job.budget}</p>

          {/* Handle error if artisan data is not found */}
          {artisanError ? (
            <p className="text-danger">❌ Artisan not found.</p>
          ) : (
            <>
              <p><strong>Artisan Daily Rate:</strong> KES {artisan?.standardRate || "N/A"}</p>
              <form onSubmit={handlePayment}>
                <div className="mb-3">
                  <label className="form-label">Number of Days Worked</label>
                  <input
                    type="number"
                    className="form-control"
                    value={daysWorked}
                    onChange={(e) => setDaysWorked(parseInt(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Agreed Amount (KES)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={agreedAmount}
                    onChange={(e) => setAgreedAmount(e.target.value)}
                  />
                  <div className="form-text">
                    Suggested: KES {suggestedAmount}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PayNowModal;
