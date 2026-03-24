import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTrailerMovies, getMovieTrailerKey } from "../services/api";
import "./LatestTrailers.css";

const TABS = [
  { key: "popular",     label: "Thịnh hành" },
  { key: "now_playing", label: "Đang chiếu" },
];

export default function LatestTrailers() {
  const [tab, setTab]         = useState("popular");
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Modal state
  const [activeKey, setActiveKey] = useState(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const railRef = useRef(null);

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  /* ── Fetch list on tab change ── */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setCanLeft(false);
    setCanRight(true);
    getTrailerMovies(tab)
      .then((data) => {
        if (!mounted) return;
        setMovies(data);
        setLoading(false);
        setTimeout(updateArrows, 100);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [tab, updateArrows]);

  /* ── Open modal: fetch trailer key on demand ── */
  const openTrailer = useCallback(async (movie) => {
    setModalLoading(true);
    setActiveTitle(movie.title);
    setActiveKey("loading");

    // Map các trailer custom theo yêu cầu
    const customTrailers = {
      "cỗ máy chiến tranh": "P6g185grMz8",
      "bóng ma anh quốc: người bất tử": "YQCKWxP1-yI",
      "tiếng thét 7": "qjHSP2gEQEc",
      "thoát khỏi tận thế": "RMnv3zqNWTQ",
      "kẻ ẩn dật": "_ftAVHih1wA",
      "tội phạm 101": "TxY9GfEEMOI",
      "thảm họa thiên thạch 2: đại di cư": "H8ieN10lX40",
      "đồi câm lặng: ác mộng trong sương": "-8trfk7CHmA",
    };

    const titleLower = movie.title.toLowerCase();
    let key = customTrailers[titleLower];

    if (!key) {
      key = await getMovieTrailerKey(movie.id);
    }

    setActiveKey(key || "NOT_FOUND");
    setModalLoading(false);
  }, []);

  const closeModal = () => setActiveKey(null);

  /* ── Scroll rail ── */
  const scroll = (dir) => {
    railRef.current?.scrollBy({
      left: dir === "left" ? -580 : 580,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="lt-section page-section">
        {/* Header row */}
        <div className="lt-header-row">
          <h2 className="lt-heading">Latest Trailers</h2>
          <div className="lt-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={"lt-tab" + (tab === t.key ? " lt-tab--active" : "")}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="lt-wrapper">
          {canLeft && (
            <button className="lt-arrow lt-arrow--left" onClick={() => scroll("left")} aria-label="Cuộn trái"><FaChevronLeft /></button>
          )}
          <div className="lt-rail" ref={railRef} onScroll={updateArrows}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="lt-card lt-card--skeleton" />
                ))
              : movies.map((m) => (
                  <TrailerCard key={m.id} movie={m} onPlay={openTrailer} />
                ))
            }
          </div>
          {canRight && (
            <button className="lt-arrow lt-arrow--right" onClick={() => scroll("right")} aria-label="Cuộn phải"><FaChevronRight /></button>
          )}
        </div>
      </section>

      {/* ── YouTube modal ── */}
      {activeKey && (
        <div className="lt-modal" onClick={closeModal} role="dialog" aria-label="Trailer">
          <div className="lt-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="lt-modal-close" onClick={closeModal} aria-label="Đóng">
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>&times;</span>
            </button>
            <p className="lt-modal-title">{activeTitle}</p>

            {activeKey === "loading" || modalLoading ? (
              <div className="lt-modal-spinner">Đang tải trailer…</div>
            ) : activeKey === "NOT_FOUND" ? (
              <div className="lt-modal-spinner">Không tìm thấy trailer trên YouTube.</div>
            ) : (
              <div className="lt-embed-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${activeKey}?autoplay=1&rel=0`}
                  title={activeTitle}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Individual trailer card ── */
function TrailerCard({ movie, onPlay }) {
  const thumb = movie.backdrop || movie.poster;
  return (
    <div className="lt-card" onClick={() => onPlay(movie)}>
      <div className="lt-thumb">
        {thumb && <img src={thumb} alt={movie.title} loading="lazy" />}
        <div className="lt-thumb-overlay">
          <span className="lt-play-btn"><FaPlay /></span>
        </div>
        {movie.rating && (
          <span className="lt-rating">{movie.rating}</span>
        )}
      </div>
      <div className="lt-card-info">
        <p className="lt-card-title">{movie.title}</p>
        {movie.year && <p className="lt-card-sub">Official Trailer • {movie.year}</p>}
      </div>
    </div>
  );
}
