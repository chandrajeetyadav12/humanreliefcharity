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
  // const loadUser = async () => {
  //   try {
  //     const res = await axios.get("/api/auth/profile", {
  //       withCredentials: true,
  //     });

  //     dispatch({ type: "SET_USER", payload: res.data.user });
  //   } catch (error) {
  //     // dispatch({ type: "LOGOUT" });
  //     // Only logout if token truly invalid
  //     if (error.response?.status === 401) {
  //       dispatch({ type: "LOGOUT" });
  //     } else {
  //       dispatch({ type: "LOGOUT" });
  //     }
  //   }
  // };
  const loadUser = async () => {
  try {
    const res = await fetch("/api/auth/profile", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();

    dispatch({ type: "SET_USER", payload: data.user });

  } catch (err) {
    dispatch({ type: "LOGOUT" });
  }
};
  useEffect(() => {


    loadUser();
  }, []);
  // useEffect(() => {
  //   loadUser();
  // }, [pathname]);

  // const login = async (data) => {
  //   const res = await axios.post("/api/auth/login", data, {
  //     withCredentials: true,
  //   });

  //   dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
  //   return res.data.user;
  // };
  const login = async (data) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const result = await res.json();

  dispatch({ type: "LOGIN_SUCCESS", payload: result.user });

  return result.user;
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
