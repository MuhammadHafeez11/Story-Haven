import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    CLEAR_ERRORS,
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGOUT_SUCCESS, 
    LOGOUT_FAIL
} from '../constants/userConstant'

// import axios from 'axios';
import axiosInstance from '../axios/axiosInstance';

// Login
export const login = (username, password) => async (dispatch) => {
    try {
      dispatch({ type: LOGIN_USER_REQUEST });
  
    //   const config = { headers: { "Content-Type": "application/json" } };
  
      const { data } = await axiosInstance.post(
        `/user/login`,
        { username, password },
      );
  
      dispatch({ type: LOGIN_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: LOGIN_USER_FAIL, payload: error.response.data.message });
    }
  };
  
  // Register
  export const register = (userData) => async (dispatch) => {
    try {
      dispatch({ type: REGISTER_USER_REQUEST });
  
      const config = { headers: { "Content-Type": "multipart/form-data" } };
  
      const { data } = await axiosInstance.post(`/user/signup`, userData);
  
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({
        type: REGISTER_USER_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  
// Logout User
export const logout = () => async (dispatch) => {
    try {
      await axiosInstance.get(`/user/logout`);
  
      dispatch({ type: LOGOUT_SUCCESS  });
    } catch (error) {
      dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
    }
  };

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
  };