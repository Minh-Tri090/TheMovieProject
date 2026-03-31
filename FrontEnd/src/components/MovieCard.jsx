import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiTrash2, FiPlay, FiInfo } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext";
import { deleteMovie } from "../services/api";
import { toast } from "../utils/toast";
import Swal from "sweetalert2";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites() || {};
  const { user } = useAuth() || {};

  // --- LOGIC HOVER CỦA TAI ---
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState(null);
  const hoverTimer = useRef(null);
  const cardRef = useRef(null);

  // ID đồng nhất cho cả 2 nguồn (Huy)
  const movieId = movie._id || movie.id;
  const favorite =
    isFavorite && typeof isFavorite === "function" && movieId
      ? isFavorite(movieId)
      : false;

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      if (cardRef.current) {
        setRect(cardRef.current.getBoundingClientRect());
      }
      setIsHovered(true);
    }, 800); // Giảm xuống 800ms cho cảm giác nhạy hơn 1000ms
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsHovered(false);
  };

  const handleCardClick = (e) => {
    // Chặn chuyển trang khi bấm nút chức năng (Huy) - chỉ còn nút xóa admin
    if (e.target.closest(".delete-btn")) return;
    navigate(`/movie/${movieId}`);
  };

  // --- LOGIC XÓA ADMIN CỦA HUY ---
  const handleDelete = async (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Xóa phim này?",
      text: `Huy chắc chắn muốn xóa "${movie.title}" chứ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Xóa luôn!",
      cancelButtonText: "Hủy",
      background: "#1e293b",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMovie(movieId);
          toast.success("Đã xóa phim thành công!");
          window.location.reload();
        } catch (error) {
          toast.error("Không thể xóa phim này!");
        }
      }
    });
  };

  return (
    <div
      className="movie-card-wrapper"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        height: "100%",
        zIndex: isHovered ? 50 : 1,
      }}
    >
      {/* 1. Card chính hiện trên Grid */}
      <div
        className="movie-card"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        style={{ opacity: isHovered ? 0 : 1, transition: "opacity 0.2s ease" }}
      >
        <img src={movie.poster} alt={movie.title} loading="lazy" />

        {/* Nút Xóa Admin của Huy */}
        {user && user.role === "admin" && (
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Xóa phim"
          >
            <FiTrash2 />
          </button>
        )}

        <div className="movie-meta">
          <h3>{movie.title}</h3>
          <p>
            {movie.year} • ★ {movie.rating || "N/A"}
          </p>
        </div>
      </div>

      {/* 2. Popover "Netflix Style" khi Hover (Tai) */}
      {isHovered &&
        rect &&
        createPortal(
          <div
            className="movie-popover"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "fixed",
              top: rect.top + rect.height / 2,
              left: rect.left + rect.width / 2,
              zIndex: 999999,
            }}
          >
            <img
              className="popover-backdrop"
              src={movie.backdrop || movie.poster}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movieId}`)}
            />
            <div className="popover-content">
              <h3 className="popover-title">{movie.title}</h3>

              <div className="popover-actions">
                <button
                  className="btn-play-sm"
                  onClick={() => navigate(`/watch/${movieId}`)}
                >
                  <FiPlay /> Xem ngay
                </button>
                <button
                  className="btn-action-sm"
                  onClick={(e) => { e.stopPropagation(); toggleFavorite && toggleFavorite(movie); }}
                >
                  {favorite ? (
                    <AiFillHeart style={{ color: "#ef4444" }} />
                  ) : (
                    <FiHeart />
                  )}{" "}
                  Thích
                </button>
                <button
                  className="btn-action-sm"
                  onClick={() => navigate(`/movie/${movieId}`)}
                >
                  <FiInfo /> Chi tiết
                </button>
              </div>

              <div className="popover-tags">
                <span className="p-badge imdb">★ {movie.rating || "N/A"}</span>
                <span className="p-badge age">T16</span>
                <span className="p-text">{movie.year}</span>
                <span className="p-text">HD</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
