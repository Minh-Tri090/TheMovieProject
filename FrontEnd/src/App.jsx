import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. IMPORT STYLE
import "./App.css";

// 2. IMPORT COMPONENTS & PAGES
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import ActorMovies from "./pages/ActorMovies";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// 3. IMPORT CONTEXTS (Phải nằm trên cùng, trước khi sử dụng trong App)
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { KidsModeProvider } from "./context/KidsModeContext";

// 4. FUNCTION APP DUY NHẤT
export default function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <KidsModeProvider>
          <BrowserRouter>
            <div className="app-shell">
              <Navbar />

              <main className="app-shell-main">
                <Routes>
                  {/* Điều hướng chính */}
                  <Route path="/" element={<Home />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/actor/:actorName" element={<ActorMovies />} />

                  {/* Xác thực & Cá nhân */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>

              <footer className="site-footer">
                <div className="container">
                  <span>
                    © 2026 THEMOVIE - Đồ án của Nguyễn Hoàng Huy & Team
                  </span>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </KidsModeProvider>
      </FavoriteProvider>
    </AuthProvider>
  );
}
