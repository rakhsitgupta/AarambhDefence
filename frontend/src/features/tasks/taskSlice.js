import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiConnector } from '../../services/apiConnector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) {
                return rejectWithValue('Please login to access tasks');
            }
            const response = await apiConnector("GET", `${API_URL}/tasks`, null, {
                Authorization: `Bearer ${auth.token}`
            });
            if (!response.tasks) {
                return rejectWithValue(response.message || 'Failed to fetch tasks');
            }
            return response.tasks;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Session expired. Please login again');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (taskData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) {
                return rejectWithValue('No authentication token found');
            }
            const response = await apiConnector("POST", `${API_URL}/tasks`, taskData, {
                Authorization: `Bearer ${auth.token}`
            });
            return response.task;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, ...taskData }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) {
                return rejectWithValue('No authentication token found');
            }
            const response = await apiConnector("PUT", `${API_URL}/tasks/${id}`, taskData, {
                Authorization: `Bearer ${auth.token}`
            });
            return response.task;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) {
                return rejectWithValue('No authentication token found');
            }
            const response = await apiConnector("DELETE", `${API_URL}/tasks/${taskId}`, null, {
                Authorization: `Bearer ${auth.token}`
            });
            if (!response.message) {
                return rejectWithValue(response.message || 'Failed to delete task');
            }
            return taskId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = action.payload;
                state.error = null;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch tasks';
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task._id !== action.payload);
                state.error = null;
            });
    }
});

export default taskSlice.reducer; 