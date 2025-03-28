import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";  // ✅ Correct base URL

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Server error" };
    }
};
// ✅ Login User
export const loginUser = async (formData) => {
    try {
        console.log("📡 Sending Login Request:", formData); // 🔍 Debugging

        const response = await axios.post(`${API_URL}/login`, formData);
        
        console.log("✅ Login Response:", response.data);

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        return response.data;
    } catch (error) {
        console.error("❌ Login API error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Something went wrong" };
    }
};
