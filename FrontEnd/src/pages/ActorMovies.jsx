// src/pages/ActorMovies.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLocalMoviesByActor, getTmdbMoviesByActor } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function ActorMovies() {
  const { actorName } = useParams(); // Lấy tên diễn viên từ URL (ví dụ: Gong Yoo)
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ĐOẠN useEffect ĐÃ SỬA TÊN BIẾN ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Huy đặt tên biến là localMovies và tmdbMovies cho dễ hiểu nhé
        const [localMovies, tmdbMovies] = await Promise.all([
          getLocalMoviesByActor(actorName),
          getTmdbMoviesByActor(actorName),
        ]);

        // Gộp kết quả (Bây giờ tên biến đã khớp rồi)
        const mergedMovies = [...(localMovies || []), ...(tmdbMovies || [])];

        setMovies(mergedMovies);
      } catch (error) {
        console.error("Lỗi lấy phim theo diễn viên:", error);
        setMovies([]); // Nếu lỗi thì cho mảng rỗng để không crash trang
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actorName]);

  return (
    <div className="actor-movies-page container mt-20 p-5">
      <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">
        Bộ sưu tập phim của <span className="text-sky-400">{actorName}</span>
      </h2>

      {loading ? (
        <div className="text-center py-20 text-slate-400">
          Đang tìm phim cho Huy...
        </div>
      ) : movies.length > 0 ? (
        // Sử dụng lại cái movies-grid xịn xò lúc nãy
        <div className="movies-grid">
          {movies.map((movie) => (
            // Quan trọng: MovieCard của Huy phải xử lý được cả movie._id và movie.id
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-4">🙊</p>
          <p>
            TheMovie chưa tìm thấy phim nào có sự tham gia của diễn viên này.
          </p>
        </div>
      )}
    </div>
  );
}
