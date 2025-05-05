import { apiConnector } from './apiConnector';
import { endpoints } from './apis';

class AuthService {
    static async login(email, password) {
        try {
            const response = await apiConnector('POST', endpoints.LOGIN_API, {
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async signup(userData) {
        try {
            const response = await apiConnector('POST', endpoints.SIGNUP_API, userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async sendOtp(email) {
        try {
            const response = await apiConnector('POST', endpoints.SENDOTP_API, {
                email,
                checkUserPresent: true,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async verifyOtp(email, otp) {
        try {
            const response = await apiConnector('POST', endpoints.VERIFY_OTP_API, {
                email,
                otp,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async resetPassword(token, password, confirmPassword) {
        try {
            const response = await apiConnector('POST', endpoints.RESETPASSWORD_API, {
                token,
                password,
                confirmPassword,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async validateToken(token) {
        try {
            const response = await apiConnector('GET', endpoints.VALIDATE_TOKEN, null, {
                Authorization: `Bearer ${token}`,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static handleError(error) {
        if (error.response) {
            // Server responded with error
            return new Error(error.response.data?.message || 'Authentication failed');
        } else if (error.request) {
            // Request made but no response
            return new Error('No response from server');
        } else {
            // Other errors
            return new Error(error.message || 'Authentication failed');
        }
    }
}

export default AuthService; 