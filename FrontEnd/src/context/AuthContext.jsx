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

      // Lưu vào máy để duy trì đăng nhập khi F5
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (error) {
      // Đẩy lỗi ra ngoài để Form giao diện hiển thị (vd: Sai mật khẩu)
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  // Hàm đăng ký (Đã chuyển sang gọi API thật)
  const register = async ({ name, email, password }) => {
    try {
      const response = await backendApi.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
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
