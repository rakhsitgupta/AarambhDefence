import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api/v1';

class ApiService {
    static async request(config, retries = 3) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...config.headers
        };

        try {
            const response = await axios({
                ...config,
                url: `${API_BASE_URL}${config.url}`,
                headers
            });
            return response.data;
        } catch (error) {
            if (retries > 0 && this.shouldRetry(error)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.request(config, retries - 1);
            }
            throw this.handleError(error);
        }
    }

    static shouldRetry(error) {
        return (
            !error.response ||
            error.response.status === 408 ||
            error.response.status === 429 ||
            error.response.status >= 500
        );
    }

    static handleError(error) {
        if (!error.response) {
            toast.error('Network error. Please check your connection.');
            return new Error('Network error. Please check your connection.');
        }

        const { status, data } = error.response;

        switch (status) {
            case 401:
                localStorage.removeItem('token');
                window.location.href = '/login';
                return new Error('Session expired. Please login again.');
            case 403:
                return new Error('You do not have permission to perform this action.');
            case 404:
                return new Error('The requested resource was not found.');
            case 422:
                return new Error(data.message || 'Validation failed.');
            case 429:
                return new Error('Too many requests. Please try again later.');
            default:
                return new Error(data.message || 'An unexpected error occurred.');
        }
    }

    // Auth endpoints
    static async login(credentials) {
        return this.request({
            method: 'POST',
            url: '/auth/login',
            data: credentials
        });
    }

    static async register(userData) {
        return this.request({
            method: 'POST',
            url: '/auth/register',
            data: userData
        });
    }

    static async validateToken() {
        return this.request({
            method: 'GET',
            url: '/auth/validate-token'
        });
    }

    static async updateProfile(userData) {
        return this.request({
            method: 'PUT',
            url: '/auth/profile',
            data: userData
        });
    }

    // Task endpoints
    static async getTasks() {
        return this.request({
            method: 'GET',
            url: '/tasks'
        });
    }

    static async createTask(taskData) {
        return this.request({
            method: 'POST',
            url: '/tasks',
            data: taskData
        });
    }

    static async updateTask(id, taskData) {
        return this.request({
            method: 'PUT',
            url: `/tasks/${id}`,
            data: taskData
        });
    }

    static async deleteTask(id) {
        return this.request({
            method: 'DELETE',
            url: `/tasks/${id}`
        });
    }

    // Mock Test endpoints
    static async getMockTests() {
        return this.request({
            method: 'GET',
            url: '/mock-tests'
        });
    }

    static async getMockTest(id) {
        return this.request({
            method: 'GET',
            url: `/mock-tests/${id}`
        });
    }

    static async submitMockTest(id, answers) {
        return this.request({
            method: 'POST',
            url: `/mock-tests/${id}/submit`,
            data: { answers }
        });
    }

    // Study Materials endpoints
    static async getStudyMaterials() {
        return this.request({
            method: 'GET',
            url: '/study-materials'
        });
    }

    static async getStudyMaterial(id) {
        return this.request({
            method: 'GET',
            url: `/study-materials/${id}`
        });
    }

    static async enrollInStudyMaterial(id) {
        return this.request({
            method: 'POST',
            url: `/study-materials/${id}/enroll`
        });
    }

    // Progress tracking
    static async getProgress() {
        return this.request({
            method: 'GET',
            url: '/progress'
        });
    }

    static async updateProgress(data) {
        return this.request({
            method: 'PUT',
            url: '/progress',
            data
        });
    }
}

export default ApiService; 