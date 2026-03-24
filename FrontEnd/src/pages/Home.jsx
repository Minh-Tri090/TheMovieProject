import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useKidsMode } from "../context/KidsModeContext"; // Import công tắc trẻ em

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const { user } = useAuth() || {};
  const { isKidsMode } = useKidsMode(); // Lấy trạng thái từ Context

  useEffect(() => {
    let mounted = true;

    const loadMovies = async () => {
      try {
        setLoading(true);
        // TRUYỀN isKidsMode VÀO ĐÂY: Để API biết đường mà lọc phim hoạt hình
        const data = await getMovies(isKidsMode);

        if (!mounted) return;
        setMovies(data || []);
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError("Không thể tải danh sách phim.");
        setLoading(false);
      }
    };

    loadMovies();

    return () => {
      mounted = false;
    };
  }, [isKidsMode]); // QUAN TRỌNG: Re-run effect mỗi khi isKidsMode thay đổi

  // Logic lọc nhanh tại chỗ theo Search Input
  const filtered = movies.filter((m) =>
    (m.title || "").toLowerCase().includes((query || "").toLowerCase()),
  );

  // Xác định phim nổi bật (Banner)
  const featured = !query && filtered.length > 0 ? filtered[0] : null;
  const list = featured ? filtered.slice(1) : filtered;

  return (
    <main className="site-main">
      <div className="container">
        <section className="surface home-surface">
          <div className="home-header">
            <div className="home-title-block">
              {/* Thay đổi tiêu đề linh hoạt theo chế độ */}
              <h1>
                {isKidsMode
                  ? "🌈 Thế giới hoạt hình vui nhộn"
                  : "Khám phá thế giới phim hôm nay"}
              </h1>
              <p className="page-subtitle">
                {isKidsMode
                  ? "Những bộ phim hay nhất dành riêng cho các bé và gia đình."
                  : "Các bộ phim đang được xem nhiều nhất trên TheMovie."}
              </p>

              <div className="home-chips">
                <span className="chip">Tổng: {movies.length} phim</span>
                {isKidsMode && (
                  <span className="chip bg-green-600 text-white">
                    Chế độ trẻ em: BẬT
                  </span>
                )}
              </div>
            </div>

            <div className="home-search-wrapper">
              <input
                className="input"
                aria-label="Tìm kiếm phim"
                placeholder={
                  isKidsMode
                    ? "Tìm phim hoạt hình..."
                    : "Lọc nhanh trong danh sách..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Banner Phim Nổi Bật (Tự động đổi theo Mode) */}
          {featured && (
            <div className="home-hero">
              <div className="home-hero-poster">
                <img
                  src={featured.backdrop || featured.poster}
                  alt={featured.title}
                />
              </div>
              <div className="home-hero-content">
                <div className="badge">Nổi bật</div>
                <h2>{featured.title}</h2>
                <p className="home-hero-meta">
                  {featured.year && <span>📅 {featured.year}</span>}
                  {featured.rating && <span>⭐ {featured.rating}/10</span>}
                </p>
                <p className="home-hero-overview">{featured.overview}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="page-section alert alert-info">
              Đang lọc danh sách phim phù hợp...
            </div>
          )}

          {error && (
            <div className="page-section alert alert-error">{error}</div>
          )}

          {/* Grid danh sách phim */}
          <div className="page-section movie-grid">
            {list.length === 0 && !loading ? (
              <div className="text-center w-full py-10 text-slate-400">
                <p className="text-4xl mb-2">🎈</p>
                <p>Không tìm thấy phim nào phù hợp Huy ơi!</p>
              </div>
            ) : (
              list.map((m) => <MovieCard key={m.id || m._id} movie={m} />)
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
