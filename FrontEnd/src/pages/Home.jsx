import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../services/api"; // Chỉ giữ lại getMovies
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const { user } = useAuth() || {};

  useEffect(() => {
    let mounted = true;
    getMovies()
      .then((data) => {
        if (!mounted) return;
        setMovies(data || []);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Không thể tải danh sách phim.");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Logic lọc phim an toàn (tránh lỗi toLowerCase nếu title bị undefined)
  const filtered = movies.filter((m) =>
    (m.title || "").toLowerCase().includes((query || "").toLowerCase()),
  );

  // Xác định phim nổi bật (Banner) và danh sách phim còn lại
  const featured = !query && filtered.length > 0 ? filtered[0] : null;
  const list = featured ? filtered.slice(1) : filtered;

  return (
    <main className="site-main">
      <div className="container">
        <section className="surface home-surface">
          <div className="home-header">
            <div className="home-title-block">
              <h1>Khám phá thế giới phim hôm nay</h1>
              <p className="page-subtitle">
                Các bộ phim đang được xem nhiều nhất trên TheMovie.
              </p>
              <div className="home-chips">
                <span className="chip">Tổng: {movies.length}</span>
                {featured && <span className="chip">Gợi ý cho bạn</span>}
              </div>
            </div>

            <div className="home-search-wrapper">
              <input
                className="input"
                aria-label="Tìm kiếm phim"
                placeholder="Lọc nhanh theo tên phim trong danh sách..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {/* ĐÃ XÓA NÚT THÊM PHIM ADMIN TẠI ĐÂY */}
            </div>
          </div>

          {/* ĐÃ XÓA TOÀN BỘ FORM THÊM PHIM CŨ TẠI ĐÂY */}

          {/* Phần Banner Phim Nổi Bật */}
          {featured && (
            <div className="home-hero">
              <div className="home-hero-poster">
                {/* Sử dụng backdrop nếu có, không thì dùng poster */}
                <img
                  src={featured.backdrop || featured.poster}
                  alt={featured.title}
                />
              </div>
              <div className="home-hero-content">
                <h2>{featured.title}</h2>
                <p className="home-hero-meta">
                  {featured.year && <span>{featured.year}</span>}
                  {featured.rating && <span>★ {featured.rating}/10</span>}
                </p>
                <p className="home-hero-overview">{featured.overview}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="page-section alert alert-info">
              Đang tải danh sách phim...
            </div>
          )}

          {error && (
            <div className="page-section alert alert-error">{error}</div>
          )}

          {/* Grid danh sách phim */}
          <div className="page-section movie-grid">
            {list.length === 0 && !loading ? (
              <p className="text-muted">
                Không tìm thấy phim phù hợp với từ khóa.
              </p>
            ) : (
              list.map((m) => <MovieCard key={m.id || m._id} movie={m} />)
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
