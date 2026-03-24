import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addCustomMovie } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";

export default function AddMovie() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    year: "",
    rating: "",
    poster: "",
    backdrop: "",
    overview: "",
    actors: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Chỉ Admin mới có quyền thêm phim!");
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalData = {
        ...movieData,
        year: Number(movieData.year) || 0,
        rating: Number(movieData.rating) || 0,
        actors: movieData.actors
          .split(",")
          .map((actor) => actor.trim())
          .filter(Boolean),
      };

      await addCustomMovie(finalData);
      toast.success("Thêm phim thành công!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Thêm phim thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page-section add-movie-page">
      <section className="surface">
        <h1 className="page-title">Thêm phim mới</h1>
        <p className="page-subtitle">Nhập đầy đủ thông tin để thêm phim vào hệ thống.</p>
        <form onSubmit={handleSubmit} className="form add-movie-form">
        <label className="form-field">
          Tiêu đề
          <input
            className="input"
            value={movieData.title}
            onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="form-field">
            Năm
            <input
              className="input"
              type="number"
              value={movieData.year}
              onChange={(e) => setMovieData({ ...movieData, year: e.target.value })}
            />
          </label>
          <label className="form-field">
            Điểm
            <input
              className="input"
              type="number"
              step="0.1"
              value={movieData.rating}
              onChange={(e) => setMovieData({ ...movieData, rating: e.target.value })}
            />
          </label>
        </div>

        <label className="form-field">
          Link poster (dọc)
          <input
            className="input"
            value={movieData.poster}
            onChange={(e) => setMovieData({ ...movieData, poster: e.target.value })}
            required
          />
        </label>

        <label className="form-field">
          Link backdrop (ngang)
          <input
            className="input"
            value={movieData.backdrop}
            onChange={(e) => setMovieData({ ...movieData, backdrop: e.target.value })}
            required
          />
        </label>

        <label className="form-field">
          Diễn viên (phân tách bằng dấu phẩy)
          <input
            className="input"
            value={movieData.actors}
            onChange={(e) => setMovieData({ ...movieData, actors: e.target.value })}
          />
        </label>

        <label className="form-field">
          Mô tả
          <textarea
            className="input"
            value={movieData.overview}
            onChange={(e) => setMovieData({ ...movieData, overview: e.target.value })}
            rows={4}
          />
        </label>

        <div className="flex gap-3 mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu phim"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </section>
  </main>
  );
}
