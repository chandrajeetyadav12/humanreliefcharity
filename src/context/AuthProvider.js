"use client";

import { useReducer, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { AuthReducer, initialState } from "./AuthReducer";
import { usePathname } from "next/navigation";
export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const pathname = usePathname();
  // Load user on refresh
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
  useEffect(() => {


    loadUser();
  }, []);
  useEffect(() => {
    loadUser();
  }, [pathname]);

  const login = async (data) => {
    const res = await axios.post("/api/auth/login", data, {
      withCredentials: true,
    });

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
    return res.data.user;
  };

  // const logout = async () => {
  //   await axios.post("/api/auth/logout", {}, { withCredentials: true });
  //   dispatch({ type: "LOGOUT" });
  // };
  const logout = async () => {
  try {
    // Call API to destroy session / clear cookie
    await axios.post("/api/auth/logout", {}, { withCredentials: true });

    // Clear React state
    dispatch({ type: "LOGOUT" });

    // Force reload to login page — prevents browser back from showing dashboard
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
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
