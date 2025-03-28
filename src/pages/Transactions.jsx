import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState(""); // State for top-up amount
  const [error, setError] = useState(""); // Error handling state
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      alert("You need to be logged in to view transactions.");
      navigate("/login");
      return;
    }

    // Fetch wallet and transaction history
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`https://myfundi-server-93521f94d28e.herokuapp.com/api/transactions/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(res.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        setLoading(false);
      }
    };

    const fetchWallet = async () => {
      try {
        const res = await axios.get(`https://myfundi-server-93521f94d28e.herokuapp.com/api/wallet/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWallet(res.data.wallet);
      } catch (err) {
        console.error("❌ Failed to load wallet:", err);
      }
    };

    fetchTransactions();
    fetchWallet();
  }, [user, token, navigate]);

  // Handle wallet top-up
  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || isNaN(topUpAmount) || topUpAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      const res = await axios.put(
        `https://myfundi-server-93521f94d28e.herokuapp.com/api/wallet/${user.id}/topup`,
        { amount: topUpAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update wallet balance after top-up
      setWallet((prevWallet) => ({
        ...prevWallet,
        balance: prevWallet.balance + parseFloat(topUpAmount),
      }));

      // Optionally, you can refetch transactions here if needed
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        {
          transactionType: "topup",
          amount: parseFloat(topUpAmount),
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance + parseFloat(topUpAmount),
          description: "Wallet top-up",
          createdAt: new Date(),
        },
      ]);

      alert(res.data.message); // Display success message
      setTopUpAmount(""); // Clear input field
      setError(""); // Reset error
    } catch (error) {
      console.error("❌ Error processing top-up:", error);
      setError("Failed to top up. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Transaction History</h1>
      
      {/* Top-up Wallet Section */}
      <div className="mb-4">
        <h3>💰 Top Up Wallet</h3>
        <form onSubmit={handleTopUp}>
          <div className="mb-3">
            <label htmlFor="topUpAmount" className="form-label">Enter Amount to Top Up (KES)</label>
            <input
              type="number"
              id="topUpAmount"
              className="form-control"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              min="1"
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">Top Up</button>
        </form>
      </div>

      {/* Wallet Balance */}
      {wallet && (
        <div className="mb-4">
          <h3>💰 Wallet Balance</h3>
          <p>KES {wallet.balance.toLocaleString()}</p>
        </div>
      )}

      {/* Transaction History */}
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="list-group">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="list-group-item">
              <h5>{transaction.transactionType === "payment" ? "Payment" : transaction.transactionType}</h5>
              <p><strong>Amount:</strong> KES {transaction.amount}</p>
              <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {transaction.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;
