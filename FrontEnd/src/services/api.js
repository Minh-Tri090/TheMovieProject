import axios from "axios";

// ==========================================
// 1. CẤU HÌNH BIẾN MÔI TRƯỜNG & HẰNG SỐ
// ==========================================
const TMDB_API_KEY = "9ba80114bb38fd0762fd585252885e68";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const FAVORITES_KEY = "themovie_favorites";
const CUSTOM_MOVIES_KEY = "themovie_custom_movies";

// Ảnh mặc định khi phim không có poster
const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Image";

// ==========================================
// 2. KHỞI TẠO AXIOS INSTANCES
// ==========================================

// Instance dành cho TMDB (Dữ liệu phim quốc tế)
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "vi-VN",
  },
});

// Instance dành cho Backend của Huy (Node.js + MongoDB)
export const backendApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor: Tự động đính kèm Token vào Header cho Backend
backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ==========================================
// 3. HÀM CHUẨN HÓA DỮ LIỆU (MAPPING)
// ==========================================
// Hàm này cực kỳ quan trọng: Ép dữ liệu từ 2 nguồn về 1 kiểu để MovieCard không bị lỗi
function normalizeMovie(m) {
  if (!m) return null;
  return {
    // Ưu tiên lấy ID từ MongoDB (_id), nếu không có thì lấy ID từ TMDB
    id: m._id || m.id,
    title: m.title || m.name || "Chưa có tiêu đề",
    // Xử lý năm sản xuất
    year: m.release_date
      ? new Date(m.release_date).getFullYear()
      : m.year || "N/A",
    // Xử lý điểm đánh giá
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : m.rating || 0,
    // Xử lý ảnh Poster (Ép về 1 trường 'poster' duy nhất)
    poster: m.poster_path
      ? `${IMAGE_BASE}${m.poster_path}`
      : m.poster || PLACEHOLDER,
    // Xử lý ảnh nền
    backdrop: m.backdrop_path
      ? `${BACKDROP_BASE}${m.backdrop_path}`
      : m.backdrop || m.poster || PLACEHOLDER,
    overview: m.overview || "Không có mô tả cho bộ phim này.",
  };
}

// ==========================================
// 4. CÁC HÀM GỌI API PHIM (HYBRID)
// ==========================================

// Lấy danh sách phim trang chủ (Gộp cả Phim của Huy + TMDB)
// src/services/api.js

export async function getMovies(isKidsMode = false) {
  try {
    // 1. Cấu hình Params cho TMDB
    const tmdbParams = isKidsMode
      ? { with_genres: "16,10751" } // Chỉ lấy Hoạt hình & Gia đình
      : {};

    const [tmdbRes, backendRes] = await Promise.all([
      tmdbApi.get("/movie/popular", { params: tmdbParams }),
      backendApi.get("/movies"),
    ]);

    let tmdbMovies = (tmdbRes.data.results || []).map(normalizeMovie);
    let customMovies = (backendRes.data || []).map(normalizeMovie);

    // 2. Lọc phim của Huy nếu đang ở chế độ Trẻ em
    if (isKidsMode) {
      customMovies = customMovies.filter((m) => m.isKidsFriendly === true);
    }

    return [...customMovies, ...tmdbMovies];
  } catch (error) {
    console.error("Lỗi lấy phim:", error);
    return [];
  }
}

// Tìm kiếm phim theo từ khóa
export async function searchMovies(query) {
  if (!query) return getMovies();
  try {
    const res = await tmdbApi.get("/search/movie", { params: { query } });
    return (res.data.results || []).map(normalizeMovie);
  } catch (error) {
    return [];
  }
}

// Lấy chi tiết một bộ phim
export async function getMovieById(id) {
  try {
    // 1. Nếu ID có độ dài 24 ký tự -> Đây là phim từ MongoDB của Huy
    if (String(id).length === 24) {
      const res = await backendApi.get(`/movies/${id}`);
      return normalizeMovie(res.data); // Dùng hàm này để format dữ liệu cho đồng nhất
    }

    // 2. Nếu không, gọi API của TMDB như bình thường
    const res = await tmdbApi.get(`/movie/${id}`, {
      params: { append_to_response: "credits,videos" },
    });

    const base = normalizeMovie(res.data);
    return {
      ...base,
      genres: (res.data.genres || []).map((g) => g.name),
      cast: (res.data.credits?.cast || []).slice(0, 12).map((c) => ({
        id: c.id,
        name: c.name,
        avatar: c.profile_path ? `${IMAGE_BASE}${c.profile_path}` : PLACEHOLDER,
      })),
      trailer: res.data.videos?.results?.find(
        (v) => v.site === "YouTube" && v.type === "Trailer",
      )?.key,
    };
  } catch (error) {
    console.error("Lỗi lấy chi tiết phim:", error);
    return null;
  }
}

// ==========================================
// 5. CHỨC NĂNG DIỄN VIÊN (THEO YÊU CẦU CỦA HUY)
// ==========================================

// Lấy danh sách phim TMDB theo diễn viên
export const getTmdbMoviesByActor = async (actorName) => {
  try {
    const searchRes = await tmdbApi.get("/search/person", {
      params: { query: actorName },
    });
    const personId = searchRes.data.results[0]?.id;
    if (!personId) return [];

    const creditsRes = await tmdbApi.get(`/person/${personId}/movie_credits`);
    return (creditsRes.data.cast || []).slice(0, 20).map(normalizeMovie);
  } catch (error) {
    console.error("Lỗi TMDB Actor:", error);
    return [];
  }
};

// Lấy danh sách phim Backend theo diễn viên
export const getLocalMoviesByActor = async (actorName) => {
  try {
    const res = await backendApi.get(`/movies/actor/${actorName}`);
    return (res.data || []).map(normalizeMovie);
  } catch (error) {
    return [];
  }
};

// Lấy danh sách diễn viên đang hot (Cho menu)
export async function getTrendingPeople() {
  try {
    const res = await tmdbApi.get("/trending/person/week");
    return (res.data.results || []).map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.profile_path ? `${IMAGE_BASE}${p.profile_path}` : PLACEHOLDER,
    }));
  } catch (error) {
    return [];
  }
}

// ==========================================
// 6. QUẢN LÝ USER & ADMIN (BACKEND)
// ==========================================

export const addCustomMovie = async (movieData) => {
  const res = await backendApi.post("/movies/add", movieData);
  return res.data;
};

export const deleteMovie = async (id) => {
  return await backendApi.delete(`/movies/${id}`);
};

export const getFavorites = async () => {
  return await backendApi.get("/users/favorites");
};

// src/services/api.js

// Sửa lại để nhận thêm tham số movieData
export const toggleFavoriteApi = async (movieId, movieData) => {
  // Gửi movieData vào phần body của request POST
  return await backendApi.post(`/users/favorite/${movieId}`, movieData);
};
