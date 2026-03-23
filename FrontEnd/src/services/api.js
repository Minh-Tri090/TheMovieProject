import axios from "axios";

// --- CẤU HÌNH TMDB (DỮ LIỆU PHIM NGOÀI) ---
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const FAVORITES_KEY = "themovie_favorites";
const CUSTOM_MOVIES_KEY = "themovie_custom_movies";

// --- CẤU HÌNH BACKEND (NODE.JS CỦA HUY) ---
export const backendApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor: Tự động đính kèm Token vào Header của mỗi request gửi lên Backend
backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export async function addCustomMovie(movieData) {
  try {
    // Gửi dữ liệu lên API Backend thay vì lưu LocalStorage
    const res = await backendApi.post("/movies/add", movieData);
    return res.data; // Trả về bộ phim vừa được tạo từ MongoDB
  } catch (error) {
    throw new Error(error.response?.data?.message || "Không thể thêm phim");
  }
}
// Hàm xóa phim
export const deleteMovie = async (id) => {
  return await backendApi.delete(`/movies/${id}`);
};
