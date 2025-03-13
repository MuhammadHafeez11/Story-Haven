// src/actions/taskActions.js
import axiosInstance from '../axios/axiosInstance';
import {
  FETCH_ASSIGNED_TASKS_REQUEST,
  FETCH_ASSIGNED_TASKS_SUCCESS,
  FETCH_ASSIGNED_TASKS_FAIL,
  UPDATE_TASK_STATUS_REQUEST,
  UPDATE_TASK_STATUS_SUCCESS,
  UPDATE_TASK_STATUS_FAIL,
  ADD_NEW_TASK_REQUEST,
  ADD_NEW_TASK_SUCCESS,
  ADD_NEW_TASK_FAIL,
  CLEAR_TASK_ERRORS,
} from '../constants/taskConstants';

export const addNewTask = (taskData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_NEW_TASK_REQUEST });

    const { data } = await axiosInstance.post('/Task/tasks', taskData);

    dispatch({
      type: ADD_NEW_TASK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_NEW_TASK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Fetch Assigned Tasks
export const fetchAssignedTasks = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ASSIGNED_TASKS_REQUEST });

    const { data } = await axiosInstance.get('/AssignedTasks/assigned-tasks');

    dispatch({
      type: FETCH_ASSIGNED_TASKS_SUCCESS,
      payload: data.assignedTasks,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ASSIGNED_TASKS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update Task Status
export const updateTaskStatus = (roleId, taskId, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TASK_STATUS_REQUEST });

    await axiosInstance.patch('/AssignedTasks/update-task-status', {
      roleId,
      taskId,
      status,
    });

    dispatch({ type: UPDATE_TASK_STATUS_SUCCESS });
    dispatch(fetchAssignedTasks()); // Refresh tasks after updating
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_STATUS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Clear Errors
export const clearTaskErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_TASK_ERRORS });
};
