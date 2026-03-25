import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "../components/MovieCard";

// IMPORT CÁC COMPONENT MỚI CỦA TAI
import Top10Section from "../components/Top10Section";
import HeroSlider from "../components/HeroSlider";
import LatestTrailers from "../components/LatestTrailers";

import { getMovies } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useKidsMode } from "../context/KidsModeContext";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const { user } = useAuth() || {};
  const { isKidsMode } = useKidsMode();
  const navigate = useNavigate();

  // --- LOGIC CUỘN CHỦ ĐỀ CỦA TAI ---
  const topicScrollRef = useRef(null);
  const [canTopicLeft, setCanTopicLeft] = useState(false);
  const [canTopicRight, setCanTopicRight] = useState(true);

  const updateTopicArrows = useCallback(() => {
    const el = topicScrollRef.current;
    if (!el) return;
    setCanTopicLeft(el.scrollLeft > 4);
    setCanTopicRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scrollTopic = (dir) => {
    if (!topicScrollRef.current) return;
    topicScrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  // --- EFFECT LOAD PHIM (KẾT HỢP LOGIC HUY & TAI) ---
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        // Huy: Lấy phim theo chế độ Kids
        const data = await getMovies(isKidsMode);

        if (!mounted) return;
        setMovies(data || []);
        setLoading(false);

        // Tai: Cập nhật mũi tên chủ đề sau khi data render
        setTimeout(updateTopicArrows, 100);
      } catch (err) {
        if (!mounted) return;
        setError("Không thể tải danh sách phim.");
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [isKidsMode, updateTopicArrows]);

  // Logic lọc nhanh theo Search Input
  const filtered = movies.filter((m) =>
    (m.title || "").toLowerCase().includes((query || "").toLowerCase()),
  );

  return (
    <main className="site-main">
      <div className="container">
        <section className="surface home-surface">
          <div className="home-header">
            <div className="home-title-block">
              {/* Huy: Tiêu đề đổi theo Kids Mode */}
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
                  isKidsMode ? "Tìm phim hoạt hình..." : "Lọc nhanh..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tai: Hero Slideshow (Tự động lọc theo danh sách movies của Huy) */}
          {!loading && movies.length > 0 && !query && (
            <HeroSlider movies={movies.slice(0, 5)} />
          )}

          {/* Tai: Top 10 Section (Chỉ hiện khi không ở Kids Mode hoặc có thể tùy chỉnh) */}
          {!query && !isKidsMode && <Top10Section />}

          {/* Tai: CHỦ ĐỀ NỔI BẬT */}
          {!query && (
            <div
              className="page-section"
              style={{ position: "relative", padding: "10px 0" }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "16px",
                  fontWeight: "bold",
                  padding: "0 22px",
                }}
              >
                {isKidsMode ? "Chủ đề cho bé" : "Các chủ đề"}
              </h2>
              <div className="topic-strip" style={{ position: "relative" }}>
                {canTopicLeft && (
                  <button
                    onClick={() => scrollTopic("left")}
                    className="detail-cast-arrow detail-cast-arrow--left"
                  >
                    <FaChevronLeft />
                  </button>
                )}

                <div
                  className="topic-strip-inner hide-scrollbar"
                  ref={topicScrollRef}
                  onScroll={updateTopicArrows}
                  style={{
                    display: "flex",
                    gap: "14px",
                    overflowX: "auto",
                    padding: "4px 22px 16px",
                  }}
                >
                  {(isKidsMode
                    ? ["Hoạt Hình", "Gia Đình", "Cổ Tích"]
                    : [
                        "Hành Động",
                        "Kinh Dị",
                        "Hoạt Hình",
                        "Hài",
                        "Khoa Học Viễn Tưởng",
                        "Tình Cảm",
                      ]
                  ).map((t) => (
                    <div
                      key={t}
                      className="topic-card"
                      onClick={() =>
                        navigate(`/genre/${encodeURIComponent(t)}`)
                      }
                    >
                      <div style={{ fontWeight: "bold", fontSize: "1.15rem" }}>
                        {t}
                      </div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                        Xem thêm &gt;
                      </div>
                    </div>
                  ))}
                </div>

                {canTopicRight && (
                  <button
                    onClick={() => scrollTopic("right")}
                    className="detail-cast-arrow detail-cast-arrow--right"
                  >
                    <FaChevronRight />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tai: Latest Trailers (Ẩn khi bật Kids Mode để an toàn) */}
          {!query && !isKidsMode && <LatestTrailers />}

          {loading && (
            <div className="page-section alert alert-info">
              Đang tải dữ liệu...
            </div>
          )}
          {error && (
            <div className="page-section alert alert-error">{error}</div>
          )}

          {/* Grid danh sách phim */}
          <div className="page-section movie-grid">
            <h2
              style={{
                fontSize: "1.25rem",
                marginBottom: "20px",
                fontWeight: "bold",
                gridColumn: "1/-1",
              }}
            >
              {query ? `Kết quả cho "${query}"` : "Dành cho bạn"}
            </h2>
            {filtered.length === 0 && !loading ? (
              <p className="text-muted">Không tìm thấy phim phù hợp Huy ơi!</p>
            ) : (
              filtered.map((m) => <MovieCard key={m.id || m._id} movie={m} />)
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
