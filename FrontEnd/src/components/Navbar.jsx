import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiSearch, FiUser, FiPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getTrendingPeople, addCustomMovie } from "../services/api";

export default function Navbar() {
  const { user, login, register, logout } = useAuth();
  const navigate = useNavigate();

  // States cho Auth và Menu
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const searchRef = useRef(null);
  const [actors, setActors] = useState([]);
  const [loadingActors, setLoadingActors] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // States cho Form Đăng nhập/Đăng ký
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- MỚI: States cho Form THÊM PHIM (Đã thêm trường backdrop) ---
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    year: "",
    rating: "",
    poster: "",
    backdrop: "", // Thêm trường này để hết lỗi ảnh banner
    overview: "",
  });

  const toggleMenu = (menu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMenu = () => setOpenMenu(null);

  useEffect(() => {
    if (openMenu !== "actor" || actors.length > 0 || loadingActors) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingActors(true);
        const data = await getTrendingPeople();
        if (!cancelled) setActors(data.slice(0, 20));
      } finally {
        if (!cancelled) setLoadingActors(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [openMenu, actors.length, loadingActors]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsPanelOpen(false);
  };

  const togglePanel = () => {
    if (user) return;
    setIsPanelOpen((open) => !open);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (activeTab === "login") {
        await login(email, password);
      } else {
        await register({ name, email, password });
      }
      setIsPanelOpen(false);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý gửi phim lên MongoDB
  const handleAddMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const finalData = {
        ...movieData,
        rating: movieData.rating ? parseFloat(movieData.rating) : 0,
      };
      await addCustomMovie(movieData);
      alert("Thêm phim thành công!");
      setMovieData({
        title: "",
        year: "",
        rating: "",
        poster: "",
        backdrop: "",
        overview: "",
      });
      setIsAddMovieOpen(false);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="site-header" onMouseLeave={closeMenu}>
      <div className="container site-header-inner header-layout">
        {/* Logo */}
        <div
          className="header-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          THE<span style={{ color: "#3b82f6" }}>MOVIE</span>
        </div>

        {/* Search */}
        <div className="header-search">
          {!searchOpen && (
            <button
              type="button"
              className="header-search-button"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(
                  () => searchRef.current && searchRef.current.focus(),
                  50,
                );
              }}
            >
              <span className="header-search-icon">
                <FiSearch />
              </span>
              <span className="header-search-text">Tìm kiếm...</span>
            </button>
          )}
          {searchOpen && (
            <input
              ref={searchRef}
              type="search"
              className="header-search-input input"
              placeholder="Phim, diễn viên..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
              }}
              onBlur={() => {
                if (!searchQuery) setSearchOpen(false);
              }}
            />
          )}
        </div>

        {/* Main Menu */}
        <nav className="header-menu">
          <button
            type="button"
            className="header-menu-item"
            onClick={() => toggleMenu("topic")}
          >
            Chủ đề
          </button>
          <button
            type="button"
            className="header-menu-item"
            onClick={() => toggleMenu("genre")}
          >
            Thể loại
          </button>
          <button
            type="button"
            className="header-menu-item"
            onClick={() => toggleMenu("together")}
          >
            <span className="badge-new">NEW</span> Xem chung
          </button>
          <button
            type="button"
            className="header-menu-item"
            onClick={() => toggleMenu("country")}
          >
            Quốc gia
          </button>
          <button
            type="button"
            className="header-menu-item"
            onClick={() => toggleMenu("actor")}
          >
            Diễn viên
          </button>

          {/* Nút Thêm Phim (Chỉ Admin/User) */}
          {user && (
            <button
              type="button"
              className="header-menu-item text-sky-400 font-bold"
              onClick={() => {
                setIsAddMovieOpen(!isAddMovieOpen);
                closeMenu();
              }}
            >
              <FiPlus className="inline mr-1" /> Thêm phim
            </button>
          )}

          <button
            type="button"
            className="header-menu-item"
            onClick={() => navigate("/favorites")}
          >
            Yêu thích
          </button>
        </nav>

        {/* Member Area */}
        <div className="header-member">
          <button
            type="button"
            className="header-member-btn"
            onClick={user ? handleLogout : togglePanel}
          >
            <span className="header-member-icon">
              <FiUser />
            </span>
            <span>{user ? user.name || user.email : "Thành viên"}</span>
          </button>

          {/* Auth Panel */}
          {!user && isPanelOpen && (
            <div className="auth-panel">
              <div className="auth-panel-tabs">
                <button
                  type="button"
                  className={`auth-tab ${activeTab === "login" ? "auth-tab-active" : ""}`}
                  onClick={() => setActiveTab("login")}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  className={`auth-tab ${activeTab === "register" ? "auth-tab-active" : ""}`}
                  onClick={() => setActiveTab("register")}
                >
                  Đăng ký
                </button>
              </div>
              <form onSubmit={handleSubmit} className="form auth-form">
                {activeTab === "register" && (
                  <label className="form-field">
                    <span>Họ tên</span>
                    <input
                      className="input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                )}
                <label className="form-field">
                  <span>Email</span>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="form-field">
                  <span>Mật khẩu</span>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </label>
                {error && <div className="alert alert-error">{error}</div>}
                <button type="submit" disabled={loading}>
                  {loading
                    ? "Đang xử lý..."
                    : activeTab === "login"
                      ? "Đăng nhập"
                      : "Đăng ký"}
                </button>
              </form>
            </div>
          )}

          {/* Form Thêm Phim (Đã thêm ô nhập Backdrop) */}
          {user && isAddMovieOpen && (
            <div className="auth-panel" style={{ width: "320px" }}>
              <h3 className="p-3 text-center text-white border-b border-slate-700 font-bold">
                Thêm Phim (Admin)
              </h3>
              <form
                onSubmit={handleAddMovieSubmit}
                className="form auth-form p-3"
              >
                <input
                  className="input mb-2"
                  placeholder="Tên phim"
                  value={movieData.title}
                  onChange={(e) =>
                    setMovieData({ ...movieData, title: e.target.value })
                  }
                  required
                />
                <div className="flex gap-2 mb-2">
                  <input
                    className="input flex-1"
                    placeholder="Năm"
                    value={movieData.year}
                    onChange={(e) =>
                      setMovieData({ ...movieData, year: e.target.value })
                    }
                  />
                  <input
                    className="input flex-1"
                    placeholder="Điểm"
                    value={movieData.rating}
                    onChange={(e) =>
                      setMovieData({ ...movieData, rating: e.target.value })
                    }
                  />
                </div>
                <input
                  className="input mb-2"
                  placeholder="Link ảnh Poster (Dọc)"
                  value={movieData.poster}
                  onChange={(e) =>
                    setMovieData({ ...movieData, poster: e.target.value })
                  }
                  required
                />

                {/* --- Ô NHẬP BACKDROP QUAN TRỌNG --- */}
                <input
                  className="input mb-2 border-sky-500"
                  placeholder="Link ảnh Nền (Ngang - Backdrop)"
                  value={movieData.backdrop}
                  onChange={(e) =>
                    setMovieData({ ...movieData, backdrop: e.target.value })
                  }
                  required
                />

                <textarea
                  className="input mb-2"
                  placeholder="Mô tả phim"
                  value={movieData.overview}
                  onChange={(e) =>
                    setMovieData({ ...movieData, overview: e.target.value })
                  }
                  rows={3}
                />
                <button
                  type="submit"
                  className="bg-sky-600 w-full font-bold"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Xác nhận thêm"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* --- CÁC MENU PANEL GIỮ NGUYÊN --- */}
      {openMenu && (
        <button type="button" className="menu-scrim" onClick={closeMenu} />
      )}

      {openMenu === "topic" && (
        <div className="topic-strip">
          <div className="topic-strip-inner">
            {[
              "Viễn Tưởng",
              "Thái Lan",
              "Sitcom",
              "Chiếu Rạp",
              "Kinh Dị",
              "Cổ Trang",
              "4K",
              "Chiến Tranh",
            ].map((t) => (
              <div key={t} className="topic-card">
                <div className="topic-card-title">{t}</div>
                <div className="topic-card-link">Xem toàn bộ &gt;</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {openMenu === "genre" && (
        <div className="mega-menu">
          <div className="container mega-menu-inner">
            {[
              "Hành động",
              "Phiêu lưu",
              "Hoạt hình",
              "Hài",
              "Hình sự",
              "Tài liệu",
              "Drama",
              "Gia đình",
              "Kỳ ảo",
              "Lịch sử",
              "Kinh dị",
              "Nhạc phim",
              "Bí ẩn",
              "Lãng mạn",
              "Viễn tưởng",
              "Gây cấn",
            ].map((g) => (
              <Link
                key={g}
                to={`/genre/${g}`}
                className="mega-menu-item"
                onClick={closeMenu}
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
      )}

      {openMenu === "country" && (
        <div className="mega-menu">
          <div className="container mega-menu-inner">
            {[
              "Âu Mỹ",
              "Hàn Quốc",
              "Trung Quốc",
              "Nhật Bản",
              "Việt Nam",
              "Thái Lan",
              "Ấn Độ",
              "Hồng Kông",
              "Pháp",
              "Đức",
            ].map((c) => (
              <Link
                key={c}
                to={`/country/${c}`}
                className="mega-menu-item"
                onClick={closeMenu}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}

      {openMenu === "actor" && (
        <div className="actor-panel">
          <div className="container">
            <div className="actor-grid">
              {loadingActors ? (
                <p>Đang tải diễn viên...</p>
              ) : (
                actors.map((a) => (
                  <div key={a.id} className="actor-item">
                    <img src={a.avatar} alt={a.name} className="actor-avatar" />
                    <span>{a.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
