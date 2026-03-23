import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiTrash2 } from "react-icons/fi"; // Đã thêm FiTrash2
import { AiFillHeart } from "react-icons/ai";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext"; // Đã thêm import useAuth
import { deleteMovie } from "../services/api";
import { toast } from "../utils/toast"; // Đã thêm import toast
import Swal from "sweetalert2";

export default function MovieCard({ movie }) {
  const { toggleFavorite, isFavorite } = useFavorites() || {};
  const { user } = useAuth(); // Lấy thông tin user từ Context
  const navigate = useNavigate();

  // Kiểm tra yêu thích (Ưu tiên dùng _id của MongoDB hoặc id của TMDB)
  const movieId = movie._id || movie.id;
  const favorite = isFavorite ? isFavorite(movieId) : false;

  const handleCardClick = (e) => {
    // Chặn chuyển trang khi bấm vào nút Tim hoặc nút Xóa
    if (e.target.closest(".movie-fav-btn") || e.target.closest(".delete-btn")) {
      return;
    }
    navigate(`/movie/${movieId}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Cẩn thận hơn bằng cách chặn lan truyền sự kiện

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
          // Load lại trang để cập nhật danh sách phim mới
          window.location.reload();
        } catch (error) {
          toast.error("Không thể xóa phim này!");
        }
      }
    });
  };

  return (
    <div
      className="movie-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Nút Yêu thích */}
      <button
        type="button"
        className={`movie-fav-btn ${favorite ? "movie-fav-btn-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite && toggleFavorite(movie);
        }}
      >
        {favorite ? <AiFillHeart /> : <FiHeart />}
      </button>

      <img src={movie.poster} alt={movie.title} />

      {/* Nút Xóa dành riêng cho Admin */}
      {user && user.role === "admin" && (
        <button className="delete-btn" onClick={handleDelete} title="Xóa phim">
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
  );
}
