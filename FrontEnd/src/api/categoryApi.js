import axiosInstance from '../axios/axiosInstance';

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/category');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories', error);
    return [];
  }
};
