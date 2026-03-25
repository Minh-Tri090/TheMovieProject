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
          setFavorites(response.data); // Backend trả về mảng Object phim
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

      // CHỈ CẦN DÒNG NÀY: Truyền cả ID và Object phim vào hàm API
      // Chúng ta sẽ cập nhật hàm này ở file api.js sau
      await toggleFavoriteApi(movieId, movie);

      // Cập nhật State tại chỗ (Optimistic UI)
      setFavorites((prev) => {
        const isExist = prev.find((m) => (m._id || m.id) === movieId);
        if (isExist) {
          toast.info(`Đã bỏ "${movie.title}" khỏi yêu thích`);
          return prev.filter((m) => (m._id || m.id) !== movieId);
        } else {
          toast.success(`Đã thêm "${movie.title}" vào yêu thích`);
          return [...prev, movie];
        }
      });
    } catch (error) {
      console.error("Lỗi favorite:", error);
      toast.error("Không thể cập nhật danh sách yêu thích!");
    }
  };

  // 3. Hàm kiểm tra xem phim đã thích chưa
  const isFavorite = (movieId) => {
    // Thêm dấu "?? []" hoặc "|| []" để tránh lỗi undefined
    return (favorites || []).some((m) => (m._id || m.id) === movieId);
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
