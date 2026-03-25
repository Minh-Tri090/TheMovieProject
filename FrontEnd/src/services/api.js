import axios from "axios";

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ
// ==========================================
const TMDB_API_KEY = "9ba80114bb38fd0762fd585252885e68";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Image";

const GENRE_MAP = {
  "Hành Động": 28,
  "Phiêu Lưu": 12,
  "Hoạt Hình": 16,
  Hài: 35,
  "Hình Sự": 80,
  "Tài Liệu": 99,
  "Chính Kịch": 18,
  "Gia Đình": 10751,
  "Kỳ Ảo": 14,
  "Lịch Sử": 36,
  "Kinh Dị": 27,
  "Âm Nhạc": 10402,
  "Bí Ẩn": 9648,
  "Lãng Mạn": 10749,
  "Khoa Học Viễn Tưởng": 878,
  "Phim Truyền Hình": 10770,
  "Gây Cấn": 53,
  "Chiến Tranh": 10752,
  "Miền Tây": 37,
};

// ==========================================
// 2. KHỞI TẠO AXIOS INSTANCES
// ==========================================
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY, language: "vi-VN" },
});

export const backendApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ==========================================
// 3. CHUẨN HÓA DỮ LIỆU
// ==========================================
function normalizeMovie(m) {
  if (!m) return null;
  return {
    id: m._id || m.id,
    tmdbId: m.id, // Giữ ID gốc của TMDB để dùng cho Player/Trailer
    title: m.title || m.name || "Chưa có tiêu đề",
    year: m.release_date
      ? new Date(m.release_date).getFullYear()
      : m.year || "N/A",
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : m.rating || 0,
    poster: m.poster_path
      ? `${IMAGE_BASE}${m.poster_path}`
      : m.poster || PLACEHOLDER,
    backdrop: m.backdrop_path
      ? `${BACKDROP_BASE}${m.backdrop_path}`
      : m.backdrop || m.poster || PLACEHOLDER,
    overview: m.overview || "Không có mô tả cho bộ phim này.",
    isKidsFriendly: m.isKidsFriendly || false,
    genres: m.genres || [],
  };
}

// ==========================================
// 4. CÁC HÀM GỌI PHIM (HYBRID)
// ==========================================

export async function getMovies(isKidsMode = false) {
  try {
    const tmdbParams = isKidsMode ? { with_genres: "16,10751" } : {};
    const [tmdbRes, backendRes] = await Promise.all([
      tmdbApi.get("/movie/popular", { params: tmdbParams }),
      backendApi.get("/movies"),
    ]);
    let tmdbMovies = (tmdbRes.data.results || []).map(normalizeMovie);
    let customMovies = (backendRes.data || []).map(normalizeMovie);
    if (isKidsMode) customMovies = customMovies.filter((m) => m.isKidsFriendly);
    return [...customMovies, ...tmdbMovies];
  } catch (error) {
    return [];
  }
}

export async function searchMovies(query, isKidsMode = false) {
  if (!query) return getMovies(isKidsMode);
  try {
    const params = {
      query,
      ...(isKidsMode ? { with_genres: "16,10751" } : {}),
    };
    const res = await tmdbApi.get("/search/movie", { params });
    return (res.data.results || []).map(normalizeMovie);
  } catch (error) {
    return [];
  }
}

export async function getMovieById(id) {
  try {
    // 1. Check Backend của Huy (MongoDB ID thường dài 24 ký tự)
    if (String(id).length === 24) {
      const res = await backendApi.get(`/movies/${id}`);
      return normalizeMovie(res.data);
    }
    // 2. Gọi TMDB (ID số)
    const res = await tmdbApi.get(`/movie/${id}`, {
      params: { append_to_response: "credits,videos" },
    });
    const base = normalizeMovie(res.data);
    return {
      ...base,
      runtime: res.data.runtime,
      releaseDate: res.data.release_date,
      genres: (res.data.genres || []).map((g) => g.name),
      cast: (res.data.credits?.cast || []).slice(0, 12).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        avatar: c.profile_path ? `${IMAGE_BASE}${c.profile_path}` : PLACEHOLDER,
      })),
      trailer: res.data.videos?.results?.find(
        (v) => v.site === "YouTube" && v.type === "Trailer",
      )?.key,
    };
  } catch (error) {
    return null;
  }
}

// ==========================================
// 5. CÁC TÍNH NĂNG MỚI (PHONG CÁCH NETFLIX)
// ==========================================

export async function getMoviesByGenre(genreName) {
  const genreId = GENRE_MAP[genreName];
  const params = genreId ? { with_genres: genreId } : { query: genreName };
  const endpoint = genreId ? "/discover/movie" : "/search/movie";
  const res = await tmdbApi.get(endpoint, { params });
  return (res.data.results || []).map(normalizeMovie);
}

export async function getMoviesByCountry(countryName) {
  const codeMap = {
    "Âu Mỹ": "US",
    "Trung Quốc": "CN",
    "Hàn Quốc": "KR",
    "Nhật Bản": "JP",
  };
  const code = codeMap[countryName];
  const params = code ? { with_origin_country: code } : { query: countryName };
  const endpoint = code ? "/discover/movie" : "/search/movie";
  const res = await tmdbApi.get(endpoint, { params });
  return (res.data.results || []).map(normalizeMovie);
}

export async function getTrendingMovies() {
  const res = await tmdbApi.get("/trending/movie/day");
  return (res.data.results || []).slice(0, 10).map(normalizeMovie);
}

export async function getTrailerMovies() {
  const res = await tmdbApi.get("/movie/now_playing");
  return (res.data.results || []).slice(0, 12).map(normalizeMovie);
}

// ==========================================
// 6. QUẢN LÝ LỊCH SỬ & YÊU THÍCH (HUY)
// ==========================================

export async function recordMovieView(movieId, movieTitle) {
  try {
    await backendApi.post("/history/add", { movieId, movieTitle });
  } catch (e) {
    console.error(e);
  }
}

export const toggleFavoriteApi = async (movieId, movieData) => {
  return await backendApi.post(`/users/favorite/${movieId}`, movieData);
};

export const getFavorites = async () =>
  (await backendApi.get("/users/favorites")).data;

export const deleteMovie = async (id) =>
  await backendApi.delete(`/movies/${id}`);

export const addCustomMovie = async (movieData) =>
  (await backendApi.post("/movies/add", movieData)).data;

// Thêm hàm này vào cuối file api.js của Huy
export async function getTrendingPeople() {
  try {
    const res = await tmdbApi.get("/trending/person/week");
    return (res.data.results || []).map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.profile_path
        ? `https://image.tmdb.org/t/p/w500${p.profile_path}`
        : "https://via.placeholder.com/300x450?text=No+Avatar",
    }));
  } catch (error) {
    console.error("Lỗi lấy trending people:", error);
    return [];
  }
}

// Thêm hàm này vào cuối file api.js để sửa lỗi LatestTrailers
export async function getMovieTrailerKey(movieId) {
  try {
    const res = await tmdbApi.get(`/movie/${movieId}/videos`);
    const vids = res.data.results || [];

    // Tìm video là Trailer trên YouTube
    const trailer =
      vids.find((v) => v.site === "YouTube" && /trailer/i.test(v.type)) ||
      vids.find((v) => v.site === "YouTube" && /teaser/i.test(v.type)) ||
      vids.find((v) => v.site === "YouTube");

    return trailer ? trailer.key : null;
  } catch (error) {
    console.error("Lỗi lấy trailer key:", error);
    return null;
  }
}

// --- CHỨC NĂNG DIỄN VIÊN (Dành cho trang ActorMovies.jsx) ---

// 1. Lấy phim từ TMDB theo diễn viên
export async function getTmdbMoviesByActor(actorName) {
  try {
    const searchRes = await tmdbApi.get("/search/person", {
      params: { query: actorName },
    });
    const personId = searchRes.data.results[0]?.id;
    if (!personId) return [];

    const creditsRes = await tmdbApi.get(`/person/${personId}/movie_credits`);
    return (creditsRes.data.cast || []).slice(0, 20).map(normalizeMovie);
  } catch (error) {
    console.error("Lỗi lấy phim TMDB theo diễn viên:", error);
    return [];
  }
}

// 2. Lấy phim từ Backend của Huy theo diễn viên
export async function getLocalMoviesByActor(actorName) {
  try {
    const res = await backendApi.get(`/movies/actor/${actorName}`);
    return (res.data || []).map(normalizeMovie);
  } catch (error) {
    console.error("Lỗi lấy phim Local theo diễn viên:", error);
    return [];
  }
}
