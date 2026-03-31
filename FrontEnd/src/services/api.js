import axios from "axios";

// --- CẤU HÌNH TMDB (DỮ LIỆU PHIM NGOÀI) ---
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const FAVORITES_KEY = "themovie_favorites";
const CUSTOM_MOVIES_KEY = "themovie_custom_movies";

// --- CẤU HÌNH BACKEND (NODE.JS CỦA HUY) ---
export const backendApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor: Tự động đính kèm Token vào Header của mỗi request gửi lên Backend
backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- CÁC TIỆN ÍCH PHỤ TRỢ ---
const PLACEHOLDER_SVG = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'>" +
  "<rect width='100%' height='100%' fill='#071023'/>" +
  "<text x='50%' y='50%' fill='#9ca3af' font-family='Arial,Helvetica,sans-serif' font-size='20' dominant-baseline='middle' text-anchor='middle'>No Image</text>" +
  "</svg>",
);
const PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${PLACEHOLDER_SVG}`;

if (!API_KEY) {
  console.warn(
    "Thiếu VITE_TMDB_API_KEY. Hãy tạo FrontEnd/.env và đặt VITE_TMDB_API_KEY=<your_key>.",
  );
}

function normalizeMovie(tmdbMovie) {
  if (!tmdbMovie) return null;
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.name || "Untitled",
    year: tmdbMovie.release_date
      ? new Date(tmdbMovie.release_date).getFullYear()
      : "",
    rating: tmdbMovie.vote_average
      ? Number(tmdbMovie.vote_average.toFixed(1))
      : null,
    poster: tmdbMovie.poster_path
      ? `${IMAGE_BASE}${tmdbMovie.poster_path}`
      : PLACEHOLDER,
    overview: tmdbMovie.overview || "Không có mô tả.",
    raw: tmdbMovie,
  };
}

const client = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "vi-VN",
  },
});

// --- QUẢN LÝ LOCAL STORAGE (GIỮ NGUYÊN) ---
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}
function loadCustomMovies() {
  try {
    const raw = localStorage.getItem(CUSTOM_MOVIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCustomMovies(list) {
  localStorage.setItem(CUSTOM_MOVIES_KEY, JSON.stringify(list));
}

// --- CÁC HÀM GỌI API TMDB (GIỮ NGUYÊN) ---
export async function getMovies() {
  try {
    // 1. Lấy phim từ TMDB
    const res = await client.get("/movie/popular");
    const tmdbMovies = (res.data.results || []).map(normalizeMovie);

    // 2. Lấy phim từ Backend của Huy
    const backendRes = await backendApi.get("/movies");
    const customMovies = backendRes.data.map((movie) => ({
      ...movie,
      id: movie._id, // Map lại ID để React không báo lỗi Key
      // Nếu không có backdrop (ảnh ngang), lấy tạm poster (ảnh dọc)
      // Nếu không có cả hai, dùng cái PLACEHOLDER mà chúng ta đã định nghĩa ở đầu file
      poster: movie.poster || PLACEHOLDER,
      backdrop: movie.backdrop || movie.poster || PLACEHOLDER,
      rating: movie.rating || 0,
      year: movie.year || "N/A",
    }));

    // Trả về phim của Huy lên đầu để dễ theo dõi
    return [...customMovies, ...tmdbMovies];
  } catch (error) {
    console.error("Lỗi lấy phim:", error);
    return [];
  }
}

const GENRE_MAP = {
  "Hành Động": 28, "Phiêu Lưu": 12, "Hoạt Hình": 16, "Hài": 35,
  "Hình Sự": 80, "Tài Liệu": 99, "Chính Kịch": 18, "Gia Đình": 10751,
  "Kỳ Ảo": 14, "Lịch Sử": 36, "Kinh Dị": 27, "Âm Nhạc": 10402,
  "Bí Ẩn": 9648, "Lãng Mạn": 10749, "Khoa Học Viễn Tưởng": 878,
  "Phim Truyền Hình": 10770, "Gây Cấn": 53, "Chiến Tranh": 10752, "Miền Tây": 37
};

export async function getMoviesByGenre(genreName) {
  const genreId = GENRE_MAP[genreName];
  if (!genreId) return searchMovies(genreName);
  const res = await client.get("/discover/movie", { params: { with_genres: genreId } });
  return (res.data.results || []).map(normalizeMovie);
}

export async function getMoviesByCountry(countryName) {
  // Simple mapping for demo, usually needs region codes
  const countryParam = countryName === "Âu Mỹ" ? "US" : (countryName === "Trung Quốc" ? "CN" : "");
  const params = countryParam ? { with_origin_country: countryParam } : { query: countryName };
  const res = await client.get(countryParam ? "/discover/movie" : "/search/movie", { params });
  return (res.data.results || []).map(normalizeMovie);
}

// --- ACTOR MOVIES ---
// "Local" ở đây là dữ liệu trong Mongo (Backend) thông qua endpoint /api/movies/actor/:actorName
export async function getLocalMoviesByActor(actorName) {
  if (!actorName) return [];
  const res = await backendApi.get(`/movies/actor/${encodeURIComponent(actorName)}`);
  return res.data;
}

// Lấy phim từ TMDB bằng cách: search person -> movie_credits -> map sang format MovieCard
export async function getTmdbMoviesByActor(actorName) {
  if (!actorName) return [];
  try {
    const personRes = await client.get("/search/person", {
      params: { query: actorName, page: 1 },
    });
    const person = (personRes.data.results || [])[0];
    if (!person?.id) return [];

    const creditsRes = await client.get(`/person/${person.id}/movie_credits`);
    const cast = creditsRes.data?.cast || [];

    // Lọc ra 1 ít phim và map các field cần cho MovieCard
    return cast.slice(0, 24).map((m) => ({
      id: m.id,
      title: m.title || m.name || "Untitled",
      year: m.release_date ? new Date(m.release_date).getFullYear() : "",
      rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : null,
      poster: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : PLACEHOLDER,
      backdrop: m.backdrop_path ? `${BACKDROP_BASE}${m.backdrop_path}` : null,
      overview: m.overview || "",
    }));
  } catch (err) {
    console.error("Lỗi lấy phim theo diễn viên từ TMDB:", err);
    return [];
  }
}

export async function searchMovies(query) {
  if (!query) return getMovies();
  const res = await client.get("/search/movie", { params: { query } });
  return (res.data.results || []).map(normalizeMovie);
}

export async function getMovieById(id) {
  if (String(id).startsWith("local-")) {
    const custom = loadCustomMovies();
    return custom.find((m) => m.id === id) || null;
  }

  // Nếu ID trông như MongoDB ObjectId (24 ký tự hex) → thử backend trước
  const isMongoId = /^[a-f\d]{24}$/i.test(String(id));
  if (isMongoId) {
    try {
      const backendRes = await backendApi.get(`/movies/${id}`);
      const movie = backendRes.data;
      return {
        ...movie,
        id: movie._id,
        poster: movie.poster || PLACEHOLDER,
        backdrop: movie.backdrop || movie.poster || PLACEHOLDER,
        rating: movie.rating || 0,
        year: movie.year || "N/A",
        genres: movie.genres || [],
        cast: movie.cast || [],
        trailer: null,
        releaseDate: movie.releaseDate || "",
        runtime: movie.runtime || null,
      };
    } catch (err) {
      // Không tìm thấy trong backend, thử TMDB (unlikely nhưng safe)
      console.warn("Không tìm thấy phim trong backend, thử TMDB:", id);
    }
  }

  const res = await client.get(`/movie/${id}`, {
    params: { append_to_response: "credits,videos" },
  });
  const base = normalizeMovie(res.data);
  return {
    ...base,
    backdrop: res.data.backdrop_path
      ? `${BACKDROP_BASE}${res.data.backdrop_path}`
      : null,
    releaseDate: res.data.release_date || "",
    runtime: res.data.runtime || null,
    genres: (res.data.genres || []).map((g) => g.name),
    cast: (res.data.credits?.cast || []).slice(0, 12).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      avatar: c.profile_path ? `${IMAGE_BASE}${c.profile_path}` : PLACEHOLDER,
    })),
    trailer: (function pickTrailer() {
      const vids = res.data.videos?.results || [];
      if (!vids.length) return null;
      const ytTrailer = vids.find(
        (v) => v.site === "YouTube" && /trailer/i.test(v.type),
      );
      if (ytTrailer)
        return { site: "YouTube", key: ytTrailer.key, name: ytTrailer.name };
      const anyYt = vids.find((v) => v.site === "YouTube");
      if (anyYt) return { site: "YouTube", key: anyYt.key, name: anyYt.name };
      return null;
    })(),
  };
}

export async function getTrendingPeople() {
  const res = await client.get("/trending/person/week");
  return (res.data.results || []).map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.profile_path ? `${IMAGE_BASE}${p.profile_path}` : PLACEHOLDER,
  }));
}

export async function getTrendingMovies() {
  const res = await client.get("/trending/movie/day");
  return (res.data.results || []).slice(0, 10).map((m) => ({
    ...normalizeMovie(m),
    backdrop: m.backdrop_path ? `${BACKDROP_BASE}${m.backdrop_path}` : null,
    mediaType: m.media_type || "movie",
  }));
}

// Lấy danh sách phim kèm thumbnail để hiển thị trailer cards
export async function getTrailerMovies(type = "popular") {
  const endpoint = type === "now_playing" ? "/movie/now_playing" : "/movie/popular";
  const res = await client.get(endpoint);
  return (res.data.results || []).slice(0, 12).map((m) => ({
    id: m.id,
    title: m.title || m.name || "Untitled",
    year: m.release_date ? new Date(m.release_date).getFullYear() : "",
    backdrop: m.backdrop_path ? `${BACKDROP_BASE}${m.backdrop_path}` : null,
    poster: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : null,
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : null,
  }));
}

// Lấy trailer YouTube key cho một phim cụ thể (gọi khi click)
export async function getMovieTrailerKey(movieId) {
  const res = await client.get(`/movie/${movieId}/videos`);
  const vids = res.data.results || [];
  const trailer =
    vids.find((v) => v.site === "YouTube" && /trailer/i.test(v.type)) ||
    vids.find((v) => v.site === "YouTube" && /teaser/i.test(v.type)) ||
    vids.find((v) => v.site === "YouTube");
  return trailer ? trailer.key : null;
}

export function getFavoriteMovies() {
  return loadFavorites();
}
export function addFavoriteMovie(movie) {
  const current = loadFavorites();
  if (current.some((m) => m.id === movie.id)) return current;
  const next = [...current, movie];
  saveFavorites(next);
  return next;
}
export function removeFavoriteMovie(id) {
  const current = loadFavorites();
  const next = current.filter((m) => m.id !== id);
  saveFavorites(next);
  return next;
}

// --- FAVORITES (DB) ---
// FavoriteContext.jsx đang import các hàm này để lấy/toggle favorites trên Backend.
// Backend routes:
// - GET  /api/users/favorites
// - POST /api/users/favorite/:movieId
export async function getFavorites() {
  return backendApi.get("/users/favorites");
}

export async function toggleFavoriteApi(movieId, movieData) {
  return backendApi.post(`/users/favorite/${movieId}`, movieData);
}

export async function addCustomMovie(movieData) {
  try {
    // Gửi dữ liệu lên API Backend thay vì lưu LocalStorage
    const res = await backendApi.post("/movies/add", movieData);
    return res.data; // Trả về bộ phim vừa được tạo từ MongoDB
  } catch (error) {
    throw new Error(error.response?.data?.message || "Không thể thêm phim");
  }
}

// Admin delete movie
export async function deleteMovie(movieId) {
  return backendApi.delete(`/movies/${movieId}`);
}

// --- COMMENTS SECTION ---
export async function getComments(movieId) {
  try {
    const res = await backendApi.get(`/comments/${movieId}`);
    return res.data.map((c) => ({
      ...c,
      id: c._id, // map _id to id
      replies: (c.replies || []).map((r) => ({ ...r, id: r._id })),
    }));
  } catch (err) {
    console.error("Lỗi lấy bình luận:", err);
    return [];
  }
}

export async function addComment(commentData) {
  try {
    const res = await backendApi.post("/comments", commentData);
    const c = res.data;
    return { ...c, id: c._id, replies: [] };
  } catch (err) {
    console.error("Lỗi thêm bình luận:", err);
    return null;
  }
}

export async function updateComment(commentId, updateData) {
  try {
    const res = await backendApi.put(`/comments/${commentId}`, updateData);
    const c = res.data;
    return {
      ...c,
      id: c._id,
      replies: (c.replies || []).map((r) => ({ ...r, id: r._id })),
    };
  } catch (err) {
    console.error("Lỗi cập nhật bình luận:", err);
    return null;
  }
}

export async function addReply(commentId, replyData) {
  try {
    const res = await backendApi.post(`/comments/${commentId}/reply`, replyData);
    const r = res.data;
    return { ...r, id: r._id };
  } catch (err) {
    console.error("Lỗi thêm reply:", err);
    return null;
  }
}

export async function updateReply(commentId, replyId, updateData) {
  try {
    const res = await backendApi.put(
      `/comments/${commentId}/reply/${replyId}`,
      updateData
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi cập nhật reply:", err);
    return null;
  }
}

// --- HISTORY (LỊCH SỬ XEM PHIM) ---
// Ghi lịch sử xem phim (gọi khi user bắt đầu xem)
export async function logHistory({ movieId, tmdbId, movieTitle, moviePoster, progress = 0, duration = 0 }) {
  try {
    await backendApi.post("/history/log", { movieId, tmdbId, movieTitle, moviePoster, progress, duration });
  } catch (err) {
    console.error("Lỗi ghi lịch sử:", err);
  }
}

// Lấy lịch sử xem của user hiện tại
export async function getUserHistory() {
  try {
    const res = await backendApi.get("/history/user");
    return res.data || [];
  } catch (err) {
    console.error("Lỗi lấy lịch sử:", err);
    return [];
  }
}

// Lấy lịch sử xem của tất cả user (admin)
export async function getAllHistory() {
  try {
    const res = await backendApi.get("/history/all");
    return res.data || [];
  } catch (err) {
    console.error("Lỗi lấy lịch sử admin:", err);
    return [];
  }
}

// Xóa 1 mục lịch sử
export async function deleteHistoryItem(id) {
  try {
    await backendApi.delete(`/history/${id}`);
    return true;
  } catch (err) {
    console.error("Lỗi xóa lịch sử:", err);
    return false;
  }
}

// Xóa toàn bộ lịch sử
export async function clearAllHistory() {
  try {
    await backendApi.delete("/history/clear/all");
    return true;
  } catch (err) {
    console.error("Lỗi xóa toàn bộ lịch sử:", err);
    return false;
  }
}

