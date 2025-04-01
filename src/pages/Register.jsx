import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { ARTISAN_TYPES } from "../utils/constants"; //  Import artisan types

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "", 
    password: "",
    role: "client",
    location: "", // Location for both clients & artisans
    craft: "", // Only for artisans
    description: "", // Artisan Bio/Portfolio
    consultationFee: "", // Fee for consultation 
    standardRate: "" //  Default pricing
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ Ensure artisans provide required fields
    if (formData.role === "artisan") {
      if (!formData.craft) {
        setError("Please select your craft.");
        setLoading(false);
        return;
      }
      if (!formData.description) {
        setError("Please provide a description of your work.");
        setLoading(false);
        return;
      }
      if (!formData.consultationFee || isNaN(formData.consultationFee)) {
        setError("Please enter a valid consultation fee.");
        setLoading(false);
        return;
      }
      if (!formData.standardRate || isNaN(formData.standardRate)) {
        setError("Please enter a valid standard rate.");
        setLoading(false);
        return;
      }
    }

    if (!formData.location) {
      setError("Please enter your location.");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      alert("✅ Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 w-50 shadow">
        <h2 className="text-center mb-4">Register</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* 🔹 Full Name */}
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

          {/* 🔹 Email */}
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* 🔹 Phone Number */}
          <div className="mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* 🔹 Password */}
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

          {/* 🔹 User Role (Client or Artisan) */}
          <div className="mb-3">
            <label>User Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="form-select">
              <option value="client">Client</option>
              <option value="artisan">Artisan</option>
            </select>
          </div>

          {/* 🔹 Location Field for BOTH Clients & Artisans */}
          <div className="mb-3">
            <label>{formData.role === "client" ? "Job Location (for Clients)" : "Your Work Location (for Artisans)"}</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* 🔹 Craft Field for Artisans Only */}
          {formData.role === "artisan" && (
            <>
              <div className="mb-3">
                <label>Select Your Craft</label>
                <select name="craft" value={formData.craft} onChange={handleChange} className="form-select" required>
                  <option value="">-- Select Craft --</option>
                  {ARTISAN_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* 🔹 Description (Artisan Bio/Portfolio) */}
              <div className="mb-3">
                <label>Describe Your Work</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  required
                />
              </div>

              {/* 🔹 Consultation Fee */}
              <div className="mb-3">
                <label>Consultation Fee (KES)</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* 🔹 Standard Rate */}
              <div className="mb-3">
                <label>Standard Rate (KES)</label>
                <input
                  type="number"
                  name="standardRate"
                  value={formData.standardRate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </>
          )}

          {/* 🔹 Submit Button */}
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
