import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

// ✅ Fetch jobs from MongoDB
export const getJobs = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};

// ✅ Post a new job (Send data to MongoDB)
export const addJob = async (jobData) => {
    try {
        const token = localStorage.getItem("token"); // Get user token for authentication
        const response = await axios.post(`${API_URL}/post`, jobData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Send token for authentication
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error posting job:", error);
        throw error;
    }
};

// ✅ Update job status in MongoDB
export const updateJobStatus = async (jobId, newStatus) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/update/${jobId}`, { status: newStatus }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating job status:", error);
        throw error;
    }
};

// ✅ Delete job from MongoDB
export const deleteJob = async (jobId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/delete/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
};
