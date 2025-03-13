// src/reducers/taskReducer.js
import {
    FETCH_ASSIGNED_TASKS_REQUEST,
    FETCH_ASSIGNED_TASKS_SUCCESS,
    FETCH_ASSIGNED_TASKS_FAIL,
    UPDATE_TASK_STATUS_REQUEST,
    UPDATE_TASK_STATUS_SUCCESS,
    UPDATE_TASK_STATUS_FAIL,
    CLEAR_TASK_ERRORS,
    ADD_NEW_TASK_REQUEST,
    ADD_NEW_TASK_SUCCESS,
    ADD_NEW_TASK_FAIL,
  } from '../constants/taskConstants';
  
  const initialState = {
    tasks: [],
    loading: false,
    error: null,
    success: false,
  };

  export const taskReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ASSIGNED_TASKS_REQUEST:
      case ADD_NEW_TASK_REQUEST:
      case UPDATE_TASK_STATUS_REQUEST:
        return { ...state, loading: true };
  
      case FETCH_ASSIGNED_TASKS_SUCCESS:
        return { ...state, loading: false, tasks: action.payload };
  
        case ADD_NEW_TASK_SUCCESS:
          return {
            ...state,
            loading: false,
            tasks: [...state.tasks, action.payload.data], // Add new task to existing tasks
            success: action.payload.success,
          };
          
      case UPDATE_TASK_STATUS_SUCCESS:
        return { ...state, loading: false };
  
      case FETCH_ASSIGNED_TASKS_FAIL:
      case UPDATE_TASK_STATUS_FAIL:
      case ADD_NEW_TASK_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case CLEAR_TASK_ERRORS:
        return { ...state, error: null };
  
      default:
        return state;
    }
  };
  