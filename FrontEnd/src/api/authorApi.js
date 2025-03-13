import axiosInstance from '../axios/axiosInstance';

export const fetchAuthors = async () => {
  try {
    const response = await axiosInstance.get('/author');
    return response.data;
  } catch (error) {
    console.error('Error fetching authors', error);
    return [];
  }
};
