import { createSlice } from "@reduxjs/toolkit";

const getTokenFromLocalStorage = () => {
    try {
        const token = localStorage.getItem("token");
        return token ? JSON.parse(token) : null;
    } catch (error) {
        console.error("Error parsing token from localStorage:", error);
        return null;
    }
};

const initialState = {
    signupData: null,
    loading: false,
    token: getTokenFromLocalStorage(),
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
            try {
                if (value.payload) {
                    localStorage.setItem("token", JSON.stringify(value.payload));
                } else {
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Error storing token in localStorage:", error);
            }
        },
        logout(state) {
            state.token = null;
            state.signupData = null;
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch (error) {
                console.error("Error clearing localStorage:", error);
            }
        }
    },
});

export const { setSignupData, setLoading, setToken, logout } = authSlice.actions;

export default authSlice.reducer;