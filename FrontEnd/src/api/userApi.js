import axiosInstance from '../axios/axiosInstance';

export const fetchTotalUsers = async () => {
  try {
    const response = await axiosInstance.get('/user/totalUsersCount');
    return response.data.totalUsersCount;
  } catch (error) {
    console.error("Error fetching total users:", error);
    return 0;
  }
};

// Function for user login
export const loginUser = async (username, password) => {
  try {
    const response = await axiosInstance.post("/user/login", { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed. Please try again.");
  }
};

// Function for user signup
export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    // console.log(error.response)
    if (error.response && error.response.data) {
      // console.error(error.response.data.message)
      throw new Error(error.response.data.message);
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};