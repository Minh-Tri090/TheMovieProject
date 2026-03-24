/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
// Import backendApi mà chúng ta đã cấu hình ở file api.js
import { backendApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Khởi tạo user từ localStorage nếu đã đăng nhập trước đó
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hàm đăng nhập (Đã chuyển sang gọi API thật)
  const login = async (email, password) => {
    try {
      const response = await backendApi.post("/auth/login", {
        email,
        password,
      });
      const { token, user: userData } = response.data;

      // THÊM DÒNG NÀY ĐỂ TEST
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

  // Hàm đăng ký (Đã chuyển sang gọi API thật)
  // Tại AuthContext.jsx
  // TRONG FILE AuthContext.jsx - Kiểm tra xem có giống thế này không:
  const register = async (userData) => {
    // userData ở đây chính là nguyên cục {name, email, role, adminKey...}
    try {
      const response = await backendApi.post("/auth/register", userData);
      // ... các bước xử lý sau đó ...
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete backendApi.defaults.headers.common["Authorization"];
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
