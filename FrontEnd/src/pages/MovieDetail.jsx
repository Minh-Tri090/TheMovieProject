import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById, recordMovieView } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoriteContext';

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites() || {};

  useEffect(() => {
    let mounted = true;

    getMovieById(id)
      .then((m) => {
        if (!mounted) return;
        setMovie(m);

        console.log('Movie detail payload:', m);
        console.log('Movie trailer field:', m.trailer);

        // Ghi lại lịch sử xem khi người dùng đã đăng nhập
        if (user && user.id) {
          recordMovieView(id, m.title, 0);
        }

        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Lỗi lấy chi tiết phim:", err);
        setError("Không tìm thấy phim này Huy ơi!");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, user]);


  if (loading)
    return (
      <div className="container page-section alert alert-info">
        Đang tải thông tin phim...
      </div>
    );
  if (error)
    return (
      <div className="container page-section alert alert-error">{error}</div>
    );
  if (!movie) return null;

  // Kiểm tra xem phim đã trong danh sách yêu thích chưa
  const favorite = isFavorite ? isFavorite(movie.id) : false;

  // Lấy key trailer (Xử lý cả dạng object cũ hoặc string mới từ api.js)
  const trailerKey = movie.trailer?.key || movie.trailer;

  return (
    <main className="site-main">
      {/* 1. Backdrop (Ảnh nền) */}
      {movie.backdrop && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="container">
        <section className="surface detail-surface">
          <div className="detail-layout">
            {/* 2. Poster */}
            <div className="detail-poster">
              <img src={movie.poster} alt={movie.title} />
            </div>

            {/* 3. Thông tin chính */}
            <div className="detail-main">
              <div className="detail-header">
                <div>
                  <h1>{movie.title}</h1>
                  <p className="detail-meta">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.runtime && <span> • {movie.runtime} phút</span>}
                    {movie.genres && movie.genres.length > 0 && (
                      <span> • {movie.genres.join(" • ")}</span>
                    )}
                  </p>
                </div>

                <div className="detail-actions">
                  {movie.rating > 0 && (
                    <div className="detail-rating">
                      <span className="detail-rating-score">
                        {movie.rating}
                      </span>
                      <span className="detail-rating-label">/10 Rating</span>
                    </div>
                  )}

                  {/* Nút Trailer */}
                  {trailerKey ? (
                    <button
                      type="button"
                      className="detail-trailer-btn"
                      onClick={() => setShowTrailer(true)}
                    >
                      ▶ Xem trailer
                    </button>
                  ) : (
                    <a
                      className="detail-search-trailer"
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} trailer`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔍 Tìm trên YouTube
                    </a>
                  )}

                  {/* Nút Yêu thích */}
                  <button
                    type="button"
                    className={`detail-fav-btn ${favorite ? "detail-fav-btn-active" : ""}`}
                    onClick={() => toggleFavorite && toggleFavorite(movie)}
                  >
                    {favorite ? "❤️ Đã yêu thích" : "🤍 Thêm vào yêu thích"}
                  </button>
                </div>
              </div>

              <p className="detail-overview">{movie.overview}</p>

              <div className="detail-extra">
                {movie.releaseDate && (
                  <div className="detail-extra-item">
                    <span className="detail-extra-label">Ngày phát hành: </span>
                    <span>{movie.releaseDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Phần Diễn viên (Đã cập nhật Link) */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="page-section mt-10">
              <h2 className="detail-section-title">Diễn viên chính</h2>
              <div className="detail-cast-grid">
                {movie.cast.map((c, index) => (
                  // CHỖ THAY ĐỔI: Wrap trong Link để nhấn vào được
                  <Link
                    to={`/actor/${encodeURIComponent(c.name)}`}
                    key={c.id || index}
                    className="detail-cast-card no-underline"
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="detail-cast-avatar"
                    />
                    <div className="detail-cast-name">{c.name}</div>
                    {c.character && (
                      <div className="detail-cast-character">{c.character}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 5. Modal Trailer */}
      {showTrailer && trailerKey && (
        <div className="trailer-modal" role="dialog">
          <div
            className="trailer-modal-backdrop"
            onClick={() => setShowTrailer(false)}
          />
          <div className="trailer-modal-content">
            <button
              type="button"
              className="trailer-close"
              onClick={() => setShowTrailer(false)}
            >
              ×
            </button>
            <iframe
              title="Trailer"
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
}
