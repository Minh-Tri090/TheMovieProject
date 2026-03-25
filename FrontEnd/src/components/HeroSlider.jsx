import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaHeart, FaInfoCircle } from "react-icons/fa";
import "./HeroSlider.css";

const SLIDE_INTERVAL = 3000;

export default function HeroSlider({ movies }) {
  // Pick up to 8 movies that have a backdrop image for the rich visual
  const slides = movies.filter((m) => m.backdrop || m.poster).slice(0, 8);

  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (transitioning || idx === current) return;
      setTransitioning(true);
      setPrevIdx(current);
      setTimeout(() => {
        setCurrent(idx);
        setPrevIdx(null);
        setTransitioning(false);
      }, 450);
    },
    [transitioning, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const startTimer = useCallback(() => {
    if (slides.length <= 1) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
  }, [next, slides.length]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  if (!slides.length) return null;

  const m = slides[current];
  const bgSrc = m.backdrop || m.poster;

  return (
    <div
      className="hs-root"
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={startTimer}
    >
      {/* ── Backgrounds (crossfade via opacity) ── */}
      {slides.map((s, i) => (
        <div
          key={s.id || s._id}
          className={
            "hs-bg" +
            (i === current ? " hs-bg--active" : "") +
            (i === prevIdx ? " hs-bg--prev" : "")
          }
        >
          <img src={s.backdrop || s.poster} alt={s.title} />
          <div className="hs-overlay" />
        </div>
      ))}

      {/* ── Body ── */}
      <div className="hs-body">
        {/* Left: info */}
        <div
          key={current}
          className="hs-info"
        >
          <h2 className="hs-title">{m.title}</h2>

          <div className="hs-meta-row">
            {m.rating != null && (
              <span className="hs-pill hs-pill--yellow">★ {m.rating}</span>
            )}
            {m.year && <span className="hs-pill">'{m.year}</span>}
          </div>

          {m.overview && (
            <p className="hs-overview">{m.overview}</p>
          )}

          <div className="hs-actions">
            <Link
              to={`/movie/${m.id || m._id}`}
              className="hs-btn hs-btn--play"
            >
              <FaPlay /> Xem phim
            </Link>
            <button className="hs-btn hs-btn--fav">
              <FaHeart />
            </button>
            <Link
              to={`/movie/${m.id || m._id}`}
              className="hs-btn hs-btn--info"
            >
              <FaInfoCircle />
            </Link>
          </div>
        </div>

        {/* Right: thumbnail strip */}
        <div className="hs-thumbs">
          {slides.map((s, i) => (
            <button
              key={s.id || s._id}
              className={"hs-thumb" + (i === current ? " hs-thumb--active" : "")}
              onClick={() => goTo(i)}
              title={s.title}
            >
              <img src={s.poster || s.backdrop} alt={s.title} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="hs-progress">
        <div
          key={current + "-bar"}
          className="hs-progress-fill"
          style={{ animationDuration: `${SLIDE_INTERVAL}ms` }}
        />
      </div>

      {/* ── Dot indicators ── */}
      <div className="hs-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={"hs-dot" + (i === current ? " hs-dot--active" : "")}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
