import React, { useEffect, useState } from "react";
import axios from "axios";
import { ARTISAN_TYPES } from "../utils/constants";

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    craft: "",
    location: "",
  });
  const [reviews, setReviews] = useState([]);

  // ✅ Load user data & reviews on mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      setFormData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        password: loggedInUser.password || "",
        role: loggedInUser.role || "",
        craft: loggedInUser.craft || "",
        location: loggedInUser.location || "",
      });

      axios
        .get(`http://localhost:5000/api/reviews/${loggedInUser._id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("❌ Error fetching reviews:", err));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!formData.role) return alert("Role is required.");
    if (formData.role === "artisan" && !formData.craft) return alert("Select your craft.");
    if (!formData.location) return alert("Location is required.");

    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, ...formData } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(formData));
    setUser(formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="container mt-5">
      <h1>📝 Your Profile</h1>

      {user ? (
        <div className="card p-4 shadow">
          <form onSubmit={handleUpdate}>
            {/* Name */}
            <div className="mb-3">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label>User Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Role --</option>
                <option value="client">Client</option>
                <option value="artisan">Artisan</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-3">
              <label>
                {formData.role === "client"
                  ? "Job Location (for Clients)"
                  : "Your Work Location (for Artisans)"}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Craft (Only for artisans) */}
            {formData.role === "artisan" && (
              <div className="mb-3">
                <label>Your Craft (Skill)</label>
                <select
                  name="craft"
                  value={formData.craft}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Select Craft --</option>
                  {ARTISAN_TYPES.map((craft) => (
                    <option key={craft} value={craft}>
                      {craft}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-success w-100">
              Update Profile
            </button>
          </form>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* ⭐ Reviews Section */}
      {reviews.length > 0 && (
        <div className="mt-5">
          <h4>⭐ Reviews</h4>
          {reviews.map((review) => (
            <div key={review._id} className="border rounded p-3 mb-3">
              <strong>From:</strong> {review.reviewer?.name || "Anonymous"} <br />
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
