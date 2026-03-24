import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { useFavorites } from '../context/FavoriteContext';
import { getTrendingMovies } from "../services/api";
import "./Top10Section.css";

function Top10Card({ m, idx }) {
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState(null);
  const hoverTimer = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites() || {};
  const favorite = isFavorite ? isFavorite(m.id) : false;

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      if (cardRef.current) {
        setRect(cardRef.current.getBoundingClientRect());
      }
      setIsHovered(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsHovered(false);
  };

  return (
    <div 
      className="t10-card-wrapper" 
      ref={cardRef}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', flex: '0 0 142px', zIndex: isHovered ? 50 : 1 }}
    >
      <Link
        to={`/movie/${m.id}`}
        className="t10-card"
        style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s ease', margin: 0, marginTop: '12px' }}
      >
        <div className="t10-poster">
          <img
            src={m.poster}
            alt={m.title}
            loading="lazy"
          />
          {m.rating != null && (
            <div className="t10-badges">
              <span className="t10-badge t10-badge--gray">PĐ. 12</span>
              <span className="t10-badge t10-badge--blue">★ {m.rating}</span>
            </div>
          )}
        </div>
        <div className="t10-meta">
          <span className="t10-rank">{idx + 1}</span>
          <div className="t10-info">
            <p className="t10-title">{m.title}</p>
            <p className="t10-year">T16 • {m.year || "N/A"}</p>
          </div>
        </div>
      </Link>

      {isHovered && rect && createPortal(
        <div 
          className="movie-popover"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ 
            position: 'fixed', 
            top: rect.top + rect.height / 2, 
            left: rect.left + rect.width / 2, 
            zIndex: 999999 
          }}
        >
          <img 
            className="popover-backdrop" 
            src={m.backdrop || m.poster} 
            alt={m.title} 
            onClick={() => navigate(`/movie/${m.id}`)}
            loading="lazy"
          />
          <div className="popover-content">
            <h3 className="popover-title">{m.title}</h3>
            
            <div className="popover-actions">
              <button className="btn-play-sm" onClick={() => navigate(`/watch/${m.id}`)}>
                ▶ Xem ngay
              </button>
              <button className="btn-action-sm" onClick={() => toggleFavorite && toggleFavorite(m)}>
                {favorite ? <AiFillHeart /> : <FiHeart />} Thích
              </button>
              <button className="btn-action-sm" onClick={() => navigate(`/movie/${m.id}`)}>
                ⓘ Chi tiết
              </button>
            </div>

            <div className="popover-tags">
              <span className="p-badge imdb">IMDb {m.rating || 'N/A'}</span>
              <span className="p-badge age">T16</span>
              <span className="p-text">{m.year || '2024'}</span>
              <span className="p-text">Top {idx + 1}</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function Top10Section() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);
  const carouselRef = useRef(null);

  const updateArrows = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    let mounted = true;
    getTrendingMovies()
      .then((data) => {
        if (!mounted) return;
        setMovies(data);
        setLoading(false);
        // Give the DOM time to paint before measuring
        setTimeout(updateArrows, 100);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [updateArrows]);

  const scroll = useCallback((dir) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -620 : 620,
      behavior: "smooth",
    });
  }, []);

  if (loading) return null;
  if (!movies.length) return null;

  return (
    <div className="t10-section page-section">
      <h2 className="t10-header">
        🔥 Top 10 phim hot hôm nay
        <span className="t10-source">Nguồn: TMDB Trending</span>
      </h2>

      <div className="t10-wrapper">
        {canLeft && (
          <button
            className="t10-arrow t10-arrow--left"
            onClick={() => scroll("left")}
            aria-label="Cuộn trái"
          >
            <FaChevronLeft />
          </button>
        )}

        <div className="t10-carousel" ref={carouselRef} onScroll={updateArrows}>
          {movies.map((m, idx) => (
            <Top10Card key={m.id} m={m} idx={idx} />
          ))}
        </div>

        {canRight && (
          <button
            className="t10-arrow t10-arrow--right"
            onClick={() => scroll("right")}
            aria-label="Cuộn phải"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
