/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { backendApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await backendApi.post("/auth/login", {
        email,
        password,
      });
      const { token, user: userData } = response.data;

      console.log("Dữ liệu User từ Backend trả về:", userData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const register = async (userData) => {
    try {
      const response = await backendApi.post("/auth/register", userData);
      const { token, user: registeredUser } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(registeredUser);
      return registeredUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete backendApi.defaults.headers.common["Authorization"];
    setUser(null);
    window.location.href = "/";
  };

  const upgradeToPremium = () => {
    if (user) {
      const updatedUser = { ...user, role: "premium" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, upgradeToPremium }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
