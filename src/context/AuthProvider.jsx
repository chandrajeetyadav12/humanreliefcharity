"use client";

import { useReducer, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { AuthReducer, initialState } from "./AuthReducer";

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Load user on refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });

        dispatch({ type: "SET_USER", payload: res.data.user });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    };

    loadUser();
  }, []);

  const login = async (data) => {
    const res = await axios.post("/api/auth/login", data, {
      withCredentials: true,
    });

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
