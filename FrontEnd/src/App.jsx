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
import PremiumPage from "./pages/PremiumPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-shell-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/watch/:id" element={<MovieDetail isWatchMode={true} />} />
            <Route path="/search" element={<Search />} />
            <Route path="/genre/:name" element={<Search mode="genre" />} />
            <Route path="/country/:name" element={<Search mode="country" />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/premium" element={<PremiumPage />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <div className="container">
            <span>TheMovie</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
