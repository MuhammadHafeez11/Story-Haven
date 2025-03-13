import axiosInstance from '../axios/axiosInstance';

import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAIL,
  FETCH_COLORS_REQUEST,
  FETCH_COLORS_SUCCESS,
  FETCH_COLORS_FAIL,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAIL,
  POST_PRODUCT_REQUEST,
  POST_PRODUCT_SUCCESS,
  POST_PRODUCT_FAIL,
  POST_LOCATION_REQUEST,
  POST_LOCATION_SUCCESS,
  POST_LOCATION_FAIL,
} from '../constants/productConstants';

// Action to fetch products along with categories
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });

  try {
    // Fetch all products from the location API
    const locationResponse = await axiosInstance.get('/location/get');
    const locations = locationResponse.data;

    // Fetch categories for each product based on the categoryId
    const locationsWithCategories = await Promise.all(
      locations.map(async (location) => {
        const categoryId = location.productId.categoryId;
        try {
          const categoryResponse = await axiosInstance.get(
            `/ProductCategory/get/${categoryId}`
          );
          return {
            ...location,
            category: categoryResponse.data.name,
          };
        } catch (err) {
          console.error(`Error fetching category for ID: ${categoryId}`);
          return {
            ...location,
            category: 'Unknown Category',
          };
        }
      })
    );

    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: locationsWithCategories,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_FAIL,
      payload: error.message || 'Error fetching products',
    });
  }
};

export const fetchColors = () => async (dispatch) => {
  dispatch({ type: FETCH_COLORS_REQUEST });
  try {
    const response = await axiosInstance.get('/Color/get');
    dispatch({ type: FETCH_COLORS_SUCCESS, payload: response.data.data });
  } catch (error) {
    dispatch({ type: FETCH_COLORS_FAIL, payload: error.message });
  }
};

export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORIES_REQUEST });
  try {
    const response = await axiosInstance.get('/ProductCategory/get');
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: response.data.data });
  } catch (error) {
    dispatch({ type: FETCH_CATEGORIES_FAIL, payload: error.message });
  }
};

export const postProduct = (productData) => async (dispatch) => {
    dispatch({ type: POST_PRODUCT_REQUEST });
    try {
      const response = await axiosInstance.post('/Product/new', productData);
      dispatch({ type: POST_PRODUCT_SUCCESS, payload: response.data });
      return response.data; // Return product data for chaining location request
    } catch (error) {
      console.log(error);
      
      dispatch({ type: POST_PRODUCT_FAIL, payload: error.response?.data?.message || error.message });
      throw error; // Propagate error for further handling
    }
  };
  
  export const postLocation = (locationData) => async (dispatch) => {
    dispatch({ type: POST_LOCATION_REQUEST });
    try {
      const response = await axiosInstance.post('/Location/new', locationData);
      dispatch({ type: POST_LOCATION_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: POST_LOCATION_FAIL, payload: errorMessage });  
    throw { response: { data: { message: errorMessage } } }; 
    }
  };