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
  
  const initialState = {
    loading: false,
    products: [],
    colors: [],
    categories: [],
    error: null,
  };
  
  export const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PRODUCTS_REQUEST:
      case FETCH_COLORS_REQUEST:
      case FETCH_CATEGORIES_REQUEST:
        return { ...state, loading: true };
        case FETCH_PRODUCTS_SUCCESS:
            return { ...state, loading: false, products: action.payload };
      
          case FETCH_COLORS_SUCCESS:
            return { ...state, loading: false, colors: action.payload };
      
          case FETCH_CATEGORIES_SUCCESS:
            return { ...state, loading: false, categories: action.payload };
      
          case FETCH_PRODUCTS_FAIL:
          case FETCH_COLORS_FAIL:
          case FETCH_CATEGORIES_FAIL:
            return { ...state, loading: false, error: action.payload };
      
          default:
            return state;
        }
      };
        

      export const postProductReducer = (state = initialState, action) => {
        switch (action.type) {
          case POST_PRODUCT_REQUEST:
          case POST_LOCATION_REQUEST:
            return { ...state, loading: true, error: null };
      
          case POST_PRODUCT_SUCCESS:
            return { ...state, loading: false, productData: action.payload };
      
          case POST_LOCATION_SUCCESS:
            return { ...state, loading: false, locationData: action.payload };
      
          case POST_PRODUCT_FAIL:
          case POST_LOCATION_FAIL:
            return { ...state, loading: false, error: action.payload };
      
          default:
            return state;
        }
      };
      