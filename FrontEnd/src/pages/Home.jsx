import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "../components/MovieCard";
import Top10Section from "../components/Top10Section";
import HeroSlider from "../components/HeroSlider";
import LatestTrailers from "../components/LatestTrailers";
import { getMovies } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const { user } = useAuth() || {};
  const navigate = useNavigate();

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

  useEffect(() => {
    let mounted = true;
    getMovies()
      .then((data) => {
        if (!mounted) return;
        setMovies(data || []);
        setLoading(false);
        setTimeout(updateTopicArrows, 100);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Không thể tải danh sách phim.");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [updateTopicArrows]);

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

          {/* Hero Slideshow — tự động chuyển phim mỗi 3 giây */}
          {!loading && movies.length > 0 && !query && (
            <HeroSlider movies={movies} />
          )}

          {/* Top 10 phim hot từ TMDB Trending */}
          {!query && <Top10Section />}

          {/* CHỦ ĐỀ NỔI BẬT */}
          {!query && (
            <div className="page-section" style={{ position: 'relative', overflow: 'visible', padding: '10px 0', marginTop: '10px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 'bold', padding: '0 22px' }}>Các chủ đề</h2>
              <div className="topic-strip" style={{ position: 'relative', top: 'auto', padding: '0', zIndex: 1 }}>
                
                {canTopicLeft && (
                  <button
                    onClick={() => scrollTopic('left')}
                    style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(15,23,42,0.9)', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                  >
                    <FaChevronLeft size={18} />
                  </button>
                )}

                <div 
                  className="topic-strip-inner hide-scrollbar" 
                  ref={topicScrollRef} 
                  onScroll={updateTopicArrows}
                  style={{ padding: '4px 22px 16px', overflowX: 'auto', display: 'flex', gap: '14px', scrollBehavior: 'smooth' }}
                >
                  {[
                    "Hành Động",
                    "Kinh Dị",
                    "Hoạt Hình",
                    "Hài",
                    "Phiêu Lưu",
                    "Khoa Học Viễn Tưởng",
                    "Tình Cảm",
                  ].map((t) => (
                      <div key={t} className="topic-card" 
                        onClick={() => navigate(`/genre/${encodeURIComponent(t)}`)}
                        style={{ 
                        flex: '0 0 auto', 
                        minWidth: '180px', 
                        height: '110px',
                        marginTop: '12px', /* Reserve vertical layout space for the transform */
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        padding: '16px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: 'none', 
                        border: 'none',
                      }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.15rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{t}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Xem toàn bộ &gt;</div>
                    </div>
                  ))}
                </div>

                {canTopicRight && (
                  <button
                    onClick={() => scrollTopic('right')}
                    style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(15,23,42,0.9)', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                  >
                    <FaChevronRight size={18} />
                  </button>
                )}

              </div>
            </div>
          )}

          {/* Latest Trailers */}
          {!query && <LatestTrailers />}

          {loading && (
            <div className="page-section alert alert-info">
              Đang tải danh sách phim...
            </div>
          )}

          {error && (
            <div className="page-section alert alert-error">{error}</div>
          )}
          {/* Header gợi ý phim nổi bật */}
          {!query && (
            <div className="page-section" style={{ marginTop: '36px', marginBottom: '16px', paddingLeft: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Gợi ý các phim nổi bật
              </h2>
              <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>Được tuyển chọn đặc biệt dành riêng cho bạn</p>
            </div>
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
