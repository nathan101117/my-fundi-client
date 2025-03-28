import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About"; // Import About Us Page
import WhyUs from "./pages/WhyUs"; // Import Why Us Page
import FindJobs from "./pages/FindJobs";
import Hire from "./pages/Hire";  // ✅ Import the new Hire page
import PostJob from "./pages/PostJob"; // ✅ Ensure Post Job is included
import HireArtisan from "./pages/HireArtisan"; // ✅ Ensure HireArtisan is included
import ArtisanProfile from "./pages/ArtisanProfile";
import ArtisanOffers from "./pages/ArtisanOffers";
import ClientReviews from "./pages/ClientReviews";
import JobApplicants from "./pages/JobApplicants";
import JobApplications from "./pages/JobApplications";
import AdminDashboard from "./pages/AdminDashboard"; 
import TopUp from "./pages/TopUp";
import Transactions from "./pages/Transactions";

import './styles/global.css';
import "./styles/Home.css"; 
import "./styles/About.css"; 
import "./styles/Whyus.css"; 


function App() {
  return (
    <Router>
      <div className="app-container w-100 min-vh-100">
        <Navbar />
        <div className="content w-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />  
            <Route path="/why-us" element={<WhyUs />} />  
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/hire" element={<Hire />} /> {/* ✅ Add Hire Page */}
            <Route path="/post-job" element={<PostJob />} /> {/* ✅ Add Post Job Page */}
            <Route path="/hire-artisan" element={<HireArtisan />} /> {/* ✅ Add Hire Artisan Page */}
            <Route path="/artisan/:id" element={<ArtisanProfile />} />
            <Route path="/offers" element={<ArtisanOffers />} />
            <Route path="/client-reviews/:clientId" element={<ClientReviews />} />
            <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
            <Route path="/job-applications" element={<JobApplications />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/wallet/top-up" element={<TopUp />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
