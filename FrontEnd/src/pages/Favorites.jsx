import React from "react";
import { useFavorites } from "../context/FavoriteContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites, loading } = useFavorites();

  return (
    <div className="favorites-page container mt-20 p-5">
      <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">
        Danh sách phim yêu thích của Huy ❤️
      </h2>

      {loading ? (
        <div className="text-center py-20">Đang tải danh sách...</div>
      ) : favorites && favorites.length > 0 ? ( // THÊM: Kiểm tra favorites có tồn tại trước khi check length
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-4">🙊</p>
          <p>
            Huy chưa có phim yêu thích nào. Quay lại trang chủ để khám phá nhé!
          </p>
        </div>
      )}
    </div>
  );
}
