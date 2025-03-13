import axiosInstance from "../axios/axiosInstance";

export const searchBooks = async (searchTerm) => {
  try {
    const response = await axiosInstance.get(`/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching search results');
  }
};
