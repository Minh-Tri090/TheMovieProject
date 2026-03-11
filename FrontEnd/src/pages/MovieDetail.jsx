import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../services/api';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getMovieById(id)
      .then((m) => {
        if (!mounted) return;
        setMovie(m);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError('Không tìm thấy phim.');
        setLoading(false);
      });
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div className="container page-section alert alert-info">Đang tải thông tin phim...</div>;
  if (error) return <div className="container page-section alert alert-error">{error}</div>;
  if (!movie) return null;

  return (
    <main className="site-main">
      <div className="container">
        <section className="surface" style={{display:'flex',gap:24,alignItems:'flex-start',flexWrap:'wrap'}}>
          <img src={movie.poster} alt={movie.title} style={{width:260,borderRadius:12,flexShrink:0}} />
          <div style={{minWidth:0}}>
            <div className="page-heading" style={{marginBottom:8}}>
              <h1>{movie.title}</h1>
              {movie.rating && (
                <span className="chip">
                  <strong>{movie.rating}</strong>/10
                </span>
              )}
            </div>
            <p className="page-subtitle" style={{marginBottom:16}}>
              {movie.year && <span>{movie.year}</span>}
            </p>
            <p style={{maxWidth:640}}>{movie.overview}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
