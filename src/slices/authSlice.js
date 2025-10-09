import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for your API
// const API_URL = "http://192.168.100.107:8000/api";
const API_URL = "/api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // Initialize user from localStorage
    token: localStorage.getItem("token") || "",
    roles: localStorage.getItem("roles") || null, // Initialize roles from localStorage
    loading: false, // Added loading state
    error: null, // Added error state
  },
  reducers: {
    // Action to set user data
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload)); // Store user object
        console.log(
          "Redux: User set in state and localStorage:",
          action.payload
        );
      } else {
        localStorage.removeItem("user"); // Clear user from localStorage on null
        console.log("Redux: User removed from state and localStorage.");
      }
    },
    // Action to set authentication token
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      console.log("Redux: Token set in state and localStorage.");
    },
    // Action to set user roles
    setRole: (state, action) => {
      state.roles = action.payload;
      localStorage.setItem("roles", action.payload);
      console.log("Redux: Roles set in state and localStorage.");
    },
    // Action to handle logout
    logout: (state) => {
      state.user = null;
      state.token = "";
      state.roles = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Clear user on logout
      localStorage.removeItem("roles");
      console.log("Redux: User logged out, state and localStorage cleared.");
    },
    // Actions for loading and error states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setToken, setRole, logout, setLoading, setError } =
  authSlice.actions;

// Async Thunk for User Login
export const login = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.post(`${API_URL}/login`, credentials);
    console.log("Login successful, response data:", data);
    dispatch(setToken(data.token));
    dispatch(setRole(data.roles)); // Assuming roles are part of login response
    dispatch(setUser(data.user)); // Assuming user data is part of login response
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    dispatch(
      setError(error.response ? error.response.data.message : "Login failed")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Async Thunk for User Registration
export const register = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.post(`${API_URL}/register`, credentials);
    console.log("Registration successful, response data:", data);
    dispatch(setToken(data.token));
    // Check if the backend returns roles on registration, if not, this might be null
    dispatch(setRole(data.roles || null));
    // Crucially: Dispatch the user object received from the registration response
    dispatch(setUser(data.user));
    return true; // Indicate success
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response ? error.response.data : error.message
    );
    dispatch(
      setError(
        error.response ? error.response.data.message : "Registration failed"
      )
    );
    return false; // Indicate failure
  } finally {
    dispatch(setLoading(false));
  }
};

// Async Thunk to Fetch User Data
export const fetchUser = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if (!token) {
    console.log("fetchUser: No token found, skipping fetch.");
    dispatch(setUser(null)); // Ensure user is null if no token
    return;
  }

  // If user is already in state and localStorage, we might not need to fetch again immediately
  // unless a refresh is explicitly needed. For simplicity, we'll fetch.
  // const userInState = getState().auth.user;
  // if (userInState && userInState.id) {
  //   console.log("fetchUser: User already in state, skipping immediate fetch.");
  //   return;
  // }

  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    console.log("fetchUser: Attempting to fetch user with token:", token);
    const { data } = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("fetchUser: Successfully fetched user data:", data);
    dispatch(setUser(data.user)); // Assuming the /user endpoint returns { user: {...} }
    dispatch(setRole(data.roles || null)); // Assuming roles might be returned here too
  } catch (error) {
    console.error(
      "fetchUser failed:",
      error.response ? error.response.data : error.message
    );
    dispatch(
      setError(
        error.response ? error.response.data.message : "Failed to fetch user"
      )
    );
    // If fetching user fails due to expired token or unauthorized, log out
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log("fetchUser: Token invalid or unauthorized, logging out.");
      dispatch(logout());
    }
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
