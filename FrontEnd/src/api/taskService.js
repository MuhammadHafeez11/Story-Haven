import axiosInstance from "../axios/axiosInstance"; 

// Function to fetch tasks for a user
export const getUserTasks = async (userId) => {
  try {
    const response = await axiosInstance.get(`/AssignedTasks/tasks/${userId}`);
    return response.data.tasks || []; // Return tasks array or an empty array if none
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Optionally rethrow the error if you want to handle it in the calling component
  }
};
