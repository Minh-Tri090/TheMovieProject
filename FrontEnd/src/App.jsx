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
import PremiumPage from "./pages/PremiumPage";

// 3. IMPORT CONTEXTS
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { KidsModeProvider } from "./context/KidsModeContext";

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
                  {/* --- ĐIỀU HƯỚNG CHÍNH (KẾT HỢP HUY & TAI) --- */}
                  <Route path="/" element={<Home />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />

                  {/* Route xem phim mới từ bạn Tai */}
                  <Route
                    path="/watch/:id"
                    element={<MovieDetail isWatchMode={true} />}
                  />

                  <Route path="/search" element={<Search />} />

                  {/* Các Route lọc theo thể loại/quốc gia mới từ bạn Tai */}
                  <Route
                    path="/genre/:name"
                    element={<Search mode="genre" />}
                  />
                  <Route
                    path="/country/:name"
                    element={<Search mode="country" />}
                  />

                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/actor/:actorName" element={<ActorMovies />} />

                  {/* --- XÁC THỰC & CÁ NHÂN --- */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Trang Premium mới từ bạn Tai */}
                  <Route path="/premium" element={<PremiumPage />} />
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
