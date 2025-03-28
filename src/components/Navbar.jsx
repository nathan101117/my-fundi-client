import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const getUser = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoggedInUser(user);
    };

    const fetchWallet = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!user || !token) return;
    
      try {
        const res = await axios.get(`https://myfundi-server-93521f94d28e.herokuapp.com/api/wallet/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in the Authorization header
          }
        });
        setWallet(res.data.wallet);
      } catch (err) {
        console.error("❌ Failed to load wallet:", err);
      }
    };
    
    getUser();
    fetchWallet();

    window.addEventListener("userUpdated", () => {
      getUser();
      fetchWallet();
    });

    return () => {
      window.removeEventListener("userUpdated", getUser);
    };
  }, []);

  const triggerNavbarUpdate = () => {
    const event = new Event("userUpdated");
    window.dispatchEvent(event);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLoggedInUser(null);
    triggerNavbarUpdate();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">My Fundi</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/why-us">Why Us</Link></li>

            {/* ✅ Authenticated User Links */}
            {loggedInUser && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={loggedInUser?.role === "admin" ? "/admin" : "/dashboard"}
                  >
                    Dashboard
                  </Link>
                </li>

                {/* ✅ Show Offers tab only for artisans */}
                {loggedInUser?.role === "artisan" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/offers">Offers</Link>
                  </li>
                )}
              </>
            )}

            {/* ✅ Role-specific Main Action Button */}
            {loggedInUser ? (
              <>
                <li className="nav-item">
                  {loggedInUser?.role === "admin" ? (
                    <Link className="btn btn-light mx-2" to="/admin">
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      className="btn btn-light mx-2"
                      to={loggedInUser?.role === "client" ? "/hire" : "/find-jobs"}
                    >
                      {loggedInUser?.role === "client" ? "Hire" : "Find Jobs"}
                    </Link>
                  )}
                </li>

                {/* ✅ Wallet Badge */}
                {wallet && (
                  <li className="nav-item">
                    <span className="badge bg-success mx-2 align-middle">
                      💰 KES {wallet.balance.toLocaleString()}
                    </span>
                  </li>
                )}

                {/* ✅ User Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {loggedInUser.name}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li>
                      <Link
                        className="dropdown-item"
                        to={loggedInUser?.role === "admin" ? "/admin" : "/dashboard"}
                      >
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>

                    {/* ✅ Show "Top Up" only for artisans */}
                    {(loggedInUser?.role === "client" || loggedInUser?.role === "artisan") && (
                      <li>
                        <Link className="dropdown-item" to="/wallet/top-up">
                          Top Up Wallet
                        </Link>
                      </li>
                    )}

                    {/* ✅ Transactions dropdown for clients and artisans */}
                    {(loggedInUser?.role === "client" || loggedInUser?.role === "artisan") && (
                      <li>
                        <Link className="dropdown-item" to="/transactions">
                          View Transactions
                        </Link>
                      </li>
                    )}

                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-light mx-2" to="/register">Join</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light" to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
