import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";

import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-shell-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <div className="container">
            <span>TheMovie</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>

import ActorMovies from "./pages/ActorMovies";

// IMPORT CÁC CONTEXT (Đảm bảo đường dẫn đúng với cấu trúc của Huy nhé)
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { KidsModeProvider } from "./context/KidsModeContext";

export default function App() {
  return (
    // 1. Bọc tất cả vào AuthProvider để quản lý đăng nhập
    <AuthProvider>
      {/* 2. Bọc vào FavoriteProvider để quản lý "thả tim" */}
      <FavoriteProvider>
        {/* 3. Bọc vào KidsModeProvider để quản lý "Chế độ trẻ em" */}
        <KidsModeProvider>
          <BrowserRouter>
            <div className="app-shell">
              <Navbar />
              <main className="app-shell-main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/actor/:actorName" element={<ActorMovies />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <footer className="site-footer">
                <div className="container">
                  <span>© 2026 THEMOVIE - Đồ án của Nguyễn Hoàng Huy</span>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </KidsModeProvider>
      </FavoriteProvider>
    </AuthProvider>

  );
}
