import React from "react";
import { useNavigate } from "react-router-dom";
// PHẢI CÓ FiTrash2 ở đây để nút xóa không bị lỗi
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { deleteMovie } from "../services/api";
import { toast } from "../utils/toast"; // Import toast
import Swal from "sweetalert2";

export default function MovieCard({ movie }) {
  // Lấy dữ liệu từ context an toàn (tránh lỗi undefined)
  const favContext = useFavorites();
  const authContext = useAuth();

  const { toggleFavorite, isFavorite } = favContext || {};
  const { user } = authContext || {}; // Lấy thông tin user an toàn

  const navigate = useNavigate();

  // Tạo ID đồng nhất cho cả MongoDB (_id) và TMDB (id)
  const movieId = movie._id || movie.id;

  // Kiểm tra yêu thích
  const favorite = isFavorite && movieId ? isFavorite(movieId) : false;

  const handleCardClick = (e) => {
    // CHẶN chuyển trang nếu bấm vào nút Tim hoặc nút Xóa
    if (e.target.closest(".movie-fav-btn") || e.target.closest(".delete-btn")) {
      return;
    }
    navigate(`/movie/${movieId}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Ngăn việc bấm nút xóa mà nó lại nhảy vào trang chi tiết

    // Hiện bảng hỏi xác nhận
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
      {/* Nút Yêu thích (Tim) */}
      <button
        type="button"
        className={`movie-fav-btn ${favorite ? "movie-fav-btn-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite && toggleFavorite(movie);
        }}
        aria-label={favorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        {/* --- ĐÃ RESTORE LẠI HÌNH ❤️ THEO YÊU CẦU CỦA HUY --- */}
        <span aria-hidden>❤️</span>
        {favorite ? <AiFillHeart /> : <FiHeart />}
      </button>

      <img src={movie.poster} alt={movie.title} />

      {/* Nút Xóa (Chỉ dành riêng cho Admin) */}
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
