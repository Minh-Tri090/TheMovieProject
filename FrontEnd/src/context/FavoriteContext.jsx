import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getFavorites, toggleFavoriteApi } from "../services/api";
import { toast } from "../utils/toast";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]); // Lưu danh sách Object phim đầy đủ
  const [loading, setLoading] = useState(false);

  // 1. Tự động lấy danh sách yêu thích từ DB mỗi khi User đăng nhập
  useEffect(() => {
    const fetchFavs = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await getFavorites();
          // Filter ra các phim null (phim đã bị xóa khỏi DB nhưng vẫn còn trong favorites)
          setFavorites((response.data || []).filter(Boolean));
        } catch (error) {
          console.error("Lỗi lấy danh sách yêu thích:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFavorites([]); // Nếu logout thì xóa sạch mảng yêu thích
      }
    };
    fetchFavs();
  }, [user]);

  // 2. Hàm Toggle (Thêm/Xóa)
  // 2. Hàm Toggle (Thêm/Xóa) - Bản đã tối ưu cho Huy
  // 2. Hàm Toggle (Thêm/Xóa) - Bản đã tối ưu cho Huy
  const toggleFavorite = async (movie) => {
    if (!user) {
      return toast.error("Huy ơi, đăng nhập để lưu phim yêu thích nhé!");
    }

    try {
      const movieId = movie._id || movie.id;

      await toggleFavoriteApi(movieId, movie);

      // Kiểm tra trạng thái TRƯỚC khi gọi setFavorites (không để side effect trong state updater)
      const isExist = favorites.some((m) => (m?._id || m?.id) === movieId);

      if (isExist) {
        // Xóa khỏi yêu thích
        setFavorites((prev) => prev.filter((m) => (m?._id || m?.id) !== movieId));
        toast.info(`Đã bỏ "${movie.title}" khỏi yêu thích`);
      } else {
        // Thêm vào yêu thích
        setFavorites((prev) => [...prev, movie]);
        toast.success(`Đã thêm "${movie.title}" vào yêu thích`);
      }
    } catch (error) {
      console.error("Lỗi favorite:", error);
      toast.error("Không thể cập nhật danh sách yêu thích!");
    }
  };

  // 3. Hàm kiểm tra xem phim đã thích chưa
  const isFavorite = (movieId) => {
    // Thêm dấu "?? []" hoặc "|| []" để tránh lỗi undefined
    return (favorites || []).some((m) => (m?._id || m?.id) === movieId);
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, loading }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
