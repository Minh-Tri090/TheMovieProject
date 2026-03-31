import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLocalMoviesByActor, getTmdbMoviesByActor } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function ActorMovies() {
  const { actorName } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [localMovies, tmdbMovies] = await Promise.all([
          getLocalMoviesByActor(actorName),
          getTmdbMoviesByActor(actorName),
        ]);

        const mergedMovies = [...(localMovies || []), ...(tmdbMovies || [])];
        setMovies(mergedMovies);
      } catch (error) {
        console.error("Loi lay phim theo dien vien:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actorName]);

  return (
    <main className="site-main">
      <div className="container actor-movies-page">
        <section className="surface actor-movies-surface">
          <div className="actor-movies-hero">
            <div className="actor-movies-copy">
              <span className="actor-movies-kicker">DIỄN VIÊN</span>
              <h1 className="actor-movies-title">
                Bộ sưu tập phim của <span>{actorName}</span>
              </h1>
              <p className="actor-movies-subtitle">
                Tổng hợp các bộ phim tìm thấy theo diễn viên bạn vừa chọn.
              </p>
            </div>

            {!loading && (
              <div className="actor-movies-chip">{movies.length} phim</div>
            )}
          </div>

          {loading ? (
            <div className="actor-movies-state actor-movies-state-loading">
              Đang tìm danh sách phim...
            </div>
          ) : movies.length > 0 ? (
            <div className="actor-movies-grid movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie._id || movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="actor-movies-state actor-movies-state-empty">
              <p className="actor-movies-empty-icon">:(</p>
              <p className="actor-movies-empty-text">
                TheMovie chưa tìm thấy phim nào có sự tham gia của diễn viên
                này.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
