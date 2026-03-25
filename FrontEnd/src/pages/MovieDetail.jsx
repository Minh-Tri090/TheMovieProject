import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaCommentDots,
  FaTelegramPlane,
  FaArrowUp,
  FaArrowDown,
  FaReply,
  FaEllipsisH,
} from "react-icons/fa";

import { getMovieById, recordMovieView } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoriteContext";
import { toast } from "../utils/toast";

export default function MovieDetail({ isWatchMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const { toggleFavorite, isFavorite } = useFavorites() || {};

  // --- STATES CHUNG ---
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // --- STATES XEM PHIM (TAI) ---
  const [isWatching, setIsWatching] = useState(isWatchMode);
  const [lightsOff, setLightsOff] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);

  // --- STATES BÌNH LUẬN (TAI) ---
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyIsSpoiler, setReplyIsSpoiler] = useState(false);

  // --- LOGIC CUỘN DIỄN VIÊN (TAI) ---
  const castRef = useRef(null);
  const [castCanLeft, setCastCanLeft] = useState(false);
  const [castCanRight, setCastCanRight] = useState(true);

  const updateCastArrows = useCallback(() => {
    const el = castRef.current;
    if (!el) return;
    setCastCanLeft(el.scrollLeft > 4);
    setCastCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scrollCast = (dir) => {
    castRef.current?.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  // --- EFFECT 1: KIỂM TRA QUYỀN XEM PREMIUM (TAI) ---
  useEffect(() => {
    if (isWatchMode) {
      if (!user) {
        toast.error("Vui lòng đăng nhập tài khoản Premium để xem phim!");
        navigate("/login");
      } else if (user.role !== "premium" && user.role !== "admin") {
        toast.error("Chỉ tài khoản Premium mới có thể xem phim!");
        navigate("/premium");
      } else {
        setIsWatching(true);
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    } else {
      setIsWatching(false);
    }
  }, [isWatchMode, id, user, navigate]);

  // --- EFFECT 2: LOAD DATA & LỊCH SỬ (HUY) ---
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const m = await getMovieById(id);
        if (!mounted) return;

        if (m) {
          setMovie(m);
          // Ghi lịch sử xem của Huy
          if (user && user.id) {
            recordMovieView(id, m.title, 0);
          }
          setTimeout(updateCastArrows, 300);
        }
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError("Không tìm thấy phim.");
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [id, user, updateCastArrows]);

  // --- LOGIC VOTE BÌNH LUẬN (TAI) ---
  const handleVote = (commentId, type) => {
    if (!user) return toast.error("Vui lòng đăng nhập để đánh giá.");
    // Logic xử lý vote... (giữ nguyên code của Tai)
  };

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

  const favorite = isFavorite ? isFavorite(movie._id || movie.id) : false;
  const trailerKey = movie.trailer?.key || movie.trailer;

  return (
    <main className="site-main">
      {/* 1. Backdrop (Ẩn khi đang xem) */}
      {movie.backdrop && !isWatching && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}

      {/* Tắt đèn (Tai) */}
      {lightsOff && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 999,
          }}
        />
      )}

      <div
        className="container"
        style={{ position: "relative", zIndex: lightsOff ? 1000 : 1 }}
      >
        {/* 2. Trình phát phim (Watch Section - Tai) */}
        {isWatching && (
          <div
            className="watch-section"
            style={{
              marginBottom: "24px",
              background: "#0f172a",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              className="player-wrapper"
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                background: "#000",
              }}
            >
              <iframe
                title="Movie Player"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                src={`https://vidsrc.xyz/embed/movie?tmdb=${movie.tmdbId || id}`}
                allowFullScreen
              />
            </div>
            <div
              className="player-toolbar"
              style={{
                display: "flex",
                gap: "8px",
                padding: "12px 16px",
                background: "#1e293b",
              }}
            >
              <button onClick={() => setLightsOff(!lightsOff)} className="chip">
                {lightsOff ? "💡 Bật đèn" : "💡 Tắt đèn"}
              </button>
            </div>
          </div>
        )}

        <section className="surface detail-surface">
          <div className="detail-layout">
            <div className="detail-poster">
              <img src={movie.poster} alt={movie.title} />
            </div>

            <div className="detail-main">
              <div className="detail-header">
                <div>
                  <h1>{movie.title}</h1>
                  <p className="detail-meta">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.genres && <span> • {movie.genres.join(" • ")}</span>}
                  </p>

                  {/* Nút Xem Ngay kết nối với Watch Mode */}
                  <button
                    className="detail-play-btn"
                    onClick={() => navigate(`/watch/${id}`)}
                  >
                    <FaPlay /> {isWatching ? "Đang phát" : "Xem Ngay"}
                  </button>
                </div>

                <div className="detail-actions">
                  {trailerKey && (
                    <button
                      className="detail-trailer-btn"
                      onClick={() => setShowTrailer(true)}
                    >
                      ▶ Trailer
                    </button>
                  )}
                  <button
                    className={`detail-fav-btn ${favorite ? "detail-fav-btn-active" : ""}`}
                    onClick={() => toggleFavorite(movie)}
                  >
                    {favorite ? "❤️ Đã thích" : "🤍 Yêu thích"}
                  </button>
                </div>
              </div>
              <p className="detail-overview">{movie.overview}</p>
            </div>
          </div>

          {/* 3. Diễn viên (Kết hợp Link của Huy & Carousel của Tai) */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="page-section">
              <h2 className="detail-section-title">Diễn viên chính</h2>
              <div className="detail-cast-wrapper">
                {castCanLeft && (
                  <button
                    className="detail-cast-arrow detail-cast-arrow--left"
                    onClick={() => scrollCast("left")}
                  >
                    <FaChevronLeft />
                  </button>
                )}
                <div
                  className="detail-cast-grid"
                  ref={castRef}
                  onScroll={updateCastArrows}
                >
                  {movie.cast.map((c, index) => (
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
                    </Link>
                  ))}
                </div>
                {castCanRight && (
                  <button
                    className="detail-cast-arrow detail-cast-arrow--right"
                    onClick={() => scrollCast("right")}
                  >
                    <FaChevronRight />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. Bình luận (Hệ thống của Tai - Giữ nguyên) */}
          <div className="page-section comments-section">
            <h2 className="detail-section-title">
              <FaCommentDots /> Bình luận ({comments.length})
            </h2>
            {/* ... Render input và list comment (Huy dán phần render comment của Tai vào đây) ... */}
          </div>
        </section>
      </div>

      {/* 5. Trailer Modal */}
      {showTrailer && (
        <div className="trailer-modal">
          <div
            className="trailer-modal-backdrop"
            onClick={() => setShowTrailer(false)}
          />
          <div className="trailer-modal-content">
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
}
