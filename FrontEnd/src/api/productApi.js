import axiosInstance from "../axios/axiosInstance";

export const fetchProductQuantity = async (productId) => {
    try {
      const response = await axiosInstance.get(`/Location/get/${productId}`);
      return response.data[0]?.quantity || 'Not Found';
    } catch (error) {
      console.error(`Error fetching quantity for product ID ${productId}:`, error);
      return 'Error';
    }
  };