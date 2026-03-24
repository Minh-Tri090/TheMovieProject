import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiPlus,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiHeart,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getTrendingPeople, addCustomMovie } from "../services/api";
import { toast } from "../utils/toast";
import { useKidsMode } from "../context/KidsModeContext";

export default function Navbar() {
  const { user, login, register, logout } = useAuth();
  const { isKidsMode, toggleKidsMode } = useKidsMode();
  const navigate = useNavigate();

  // --- REFS ---
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // --- STATES GIAO DIỆN ---
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // Quản lý Mega Menu (genre, country...)

  // --- STATES AUTH (LOGIN/REGISTER) ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- STATES DỮ LIỆU & THÊM PHIM ---
  const [actors, setActors] = useState([]);
  const [loadingActors, setLoadingActors] = useState(false);
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    year: "",
    rating: "",
    poster: "",
    backdrop: "",
    overview: "",
    actors: "",
  });
  const [regRole, setRegRole] = useState("user");
  const [regAdminKey, setRegAdminKey] = useState("");

  // Import icon cho history
  const FiClock = () => <span style={{ marginRight: "8px" }}>📋</span>;

  // --- EFFECT: Đóng dropdown khi bấm ra ngoài ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- EFFECT: Lấy dữ liệu diễn viên ---
  useEffect(() => {
    if (openMenu !== "actor" || actors.length > 0) return;
    (async () => {
      try {
        setLoadingActors(true);
        const data = await getTrendingPeople();
        setActors(data.slice(0, 20));
      } finally {
        setLoadingActors(false);
      }
    })();
  }, [openMenu, actors.length]);

  // --- HANDLERS ---
  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const closeMenu = () => setOpenMenu(null);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (activeTab === "register" && password !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp Huy ơi!");
    }

    if (activeTab === "register" && regRole === "admin") {
      if (regAdminKey !== "HUY_ADMIN_2026") {
        return toast.error("Mã bí mật Admin không chính xác!");
      }
    }

    setLoading(true);

    try {
      if (activeTab === "login") {
        // 1. Hứng lấy dữ liệu user trả về từ hàm login
        const resUser = await login(email, password);

        // 2. Dùng Template Literals (dấu ` `) để truyền tên vào
        toast.success(`Chào mừng ${resUser.name} quay trở lại!`);
      } else {
        // 3. Tương tự cho phần Đăng ký
        const resUser = await register({
          name,
          email,
          password,
          role: regRole,
          adminKey: regAdminKey,
        });

        toast.success(`Chúc mừng ${resUser.name} đã đăng ký thành công!`);
      }

      setIsPanelOpen(false);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const finalData = {
        ...movieData,
        rating: movieData.rating ? parseFloat(movieData.rating) : 0,
        actors: movieData.actors.split(",").map((item) => item.trim()),
      };
      await addCustomMovie(finalData);
      toast.success("Thêm phim thành công!");
      setMovieData({
        title: "",
        year: "",
        rating: "",
        poster: "",
        backdrop: "",
        overview: "",
        actors: "",
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
        {/* 1. Logo */}
        <div
          className="header-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          THE<span style={{ color: "#3b82f6" }}>MOVIE</span>
        </div>

        {/* 2. Search */}
        <div className="header-search">
          {!searchOpen ? (
            <button
              className="header-search-button"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchRef.current?.focus(), 50);
              }}
            >
              <FiSearch />{" "}
              <span className="header-search-text">Tìm kiếm...</span>
            </button>
          ) : (
            <input
              ref={searchRef}
              className="header-search-input input"
              placeholder="Phim, diễn viên..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
              }}
              onBlur={() => !searchQuery && setSearchOpen(false)}
            />
          )}
        </div>

        {/* 3. Navigation Links */}
        <nav className="header-menu">
          <button
            className="header-menu-item"
            onClick={() => toggleMenu("topic")}
          >
            Chủ đề
          </button>
          <button
            className="header-menu-item"
            onClick={() => toggleMenu("genre")}
          >
            Thể loại
          </button>
          <button
            className="header-menu-item"
            onClick={() => toggleMenu("country")}
          >
            Quốc gia
          </button>
          <button
            className="header-menu-item"
            onClick={() => toggleMenu("actor")}
          >
            Diễn viên
          </button>

          {user && user.role === "admin" && (
            <button
              type="button"
              className="header-menu-item text-sky-400 font-bold"
              onClick={() => setIsAddMovieOpen(true)}
            >
              <FiPlus className="inline mr-1" /> Thêm phim
            </button>
          )}
        </nav>
        {/* --- NÚT GẠT CHẾ ĐỘ TRẺ EM --- */}
        <div className="kids-toggle-wrapper">
          <span className={`kids-toggle-label ${isKidsMode ? "active" : ""}`}>
            {isKidsMode ? "Kids ON" : "Kids OFF"}
          </span>
          <button
            type="button"
            onClick={toggleKidsMode}
            className={`kids-toggle-btn ${isKidsMode ? "on" : "off"}`}
            title="Chế độ trẻ em"
          >
            <div className="kids-toggle-thumb" />
          </button>
        </div>

        {/* 4. User Area (Dropdown) */}
        <div className="header-member" ref={userMenuRef}>
          {!user ? (
            <button
              className="header-member-btn"
              onClick={() => setIsPanelOpen(!isPanelOpen)}
            >
              <FiUser /> <span>Thành viên</span>
            </button>
          ) : (
            <div className="user-dropdown-wrapper">
              <button
                className={`header-member-btn ${userMenuOpen ? "active" : ""}`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar-mini">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="member-text">{user.name}</span>
                <FiChevronDown
                  className={`chevron-icon ${userMenuOpen ? "rotate" : ""}`}
                />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-info">
                    <p className="user-email">{user.email}</p>
                    <span className="user-role-badge">
                      {user.role || "Thành viên"}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    <FiUser /> Trang cá nhân
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/favorites")}
                  >
                    <FiHeart /> Phim yêu thích
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/history")}
                  >
                    <FiClock /> Lịch sử xem
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/settings")}
                  >
                    <FiSettings /> Cài đặt
                  </button>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Panel Đăng nhập / Đăng ký */}
          {!user && isPanelOpen && (
            <div className="auth-panel">
              <div className="auth-panel-tabs">
                <button
                  className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => setActiveTab("login")}
                >
                  Đăng nhập
                </button>
                <button
                  className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
                  onClick={() => setActiveTab("register")}
                >
                  Đăng ký
                </button>
              </div>
              <form onSubmit={handleAuthSubmit} className="form auth-form">
                {/* 1. Chỉ hiện khi Đăng ký */}
                {activeTab === "register" && (
                  <>
                    <label className="form-field">
                      <span>Họ tên</span>
                      <input
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </label>

                    <label className="form-field">
                      <span>Quyền hạn</span>
                      <select
                        className="input"
                        value={regRole || "user"}
                        onChange={(e) => setRegRole(e.target.value)}
                      >
                        <option value="user">Người dùng</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </label>

                    {regRole === "admin" && (
                      <label className="form-field">
                        <span className="text-yellow-500 font-bold">
                          Mã bí mật Admin
                        </span>
                        <input
                          className="input border-yellow-600"
                          type="password"
                          placeholder="Nhập mã xác minh"
                          value={regAdminKey} // Thêm dòng này
                          onChange={(e) => setRegAdminKey(e.target.value)} // Sửa thành setRegAdminKey
                        />
                      </label>
                    )}
                  </>
                )}

                {/* 2. LUÔN HIỆN (Cả Đăng nhập & Đăng ký) */}
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
                  />
                </label>

                {/* 3. Xác nhận mật khẩu (Chỉ hiện khi Đăng ký) */}
                {activeTab === "register" && (
                  <label className="form-field">
                    <span>Xác nhận mật khẩu</span>
                    <input
                      className="input"
                      type="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </label>
                )}

                {error && (
                  <div className="alert-error text-xs mt-2">{error}</div>
                )}

                <button
                  type="submit"
                  className="bg-sky-600 w-full mt-4"
                  disabled={loading}
                >
                  {loading
                    ? "Đang xử lý..."
                    : activeTab === "login"
                      ? "Đăng nhập"
                      : "Đăng ký"}
                </button>
              </form>
            </div>
          )}

          {/* Form Thêm Phim (Modal) */}
          {user && isAddMovieOpen && (
            <div className="auth-panel add-movie-panel">
              <h3 className="p-3 text-center border-b border-slate-700 font-bold">
                Thêm Phim Mới
              </h3>
              <form
                onSubmit={handleAddMovieSubmit}
                className="form auth-form p-3"
              >
                <input
                  className="input mb-2"
                  placeholder="Tiêu đề phim"
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
                  placeholder="Link Poster (Dọc)"
                  value={movieData.poster}
                  onChange={(e) =>
                    setMovieData({ ...movieData, poster: e.target.value })
                  }
                  required
                />
                <input
                  className="input mb-2 border-sky-500"
                  placeholder="Link Backdrop (Ngang)"
                  value={movieData.backdrop}
                  onChange={(e) =>
                    setMovieData({ ...movieData, backdrop: e.target.value })
                  }
                  required
                />
                <input
                  className="input mb-2 border-green-500" // Mình để border màu khác cho Huy dễ nhận diện
                  placeholder="Diễn viên (Cách nhau bằng dấu phẩy, VD: Gong Yoo, IU)"
                  value={movieData.actors}
                  onChange={(e) =>
                    setMovieData({ ...movieData, actors: e.target.value })
                  }
                />
                <textarea
                  className="input mb-2"
                  placeholder="Mô tả tóm tắt..."
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
                  Xác nhận lưu
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* --- MEGA MENUS (Topic, Genre, Country, Actor) --- */}
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
              </div>
            ))}
          </div>
        </div>
      )}

      {(openMenu === "genre" || openMenu === "country") && (
        <div className="mega-menu">
          <div className="container mega-menu-inner">
            {(openMenu === "genre"
              ? [
                  "Hành động",
                  "Hoạt hình",
                  "Hài",
                  "Kinh dị",
                  "Lãng mạn",
                  "Viễn tưởng",
                ]
              : ["Âu Mỹ", "Hàn Quốc", "Trung Quốc", "Việt Nam", "Thái Lan"]
            ).map((item) => (
              <Link
                key={item}
                to={`/${openMenu}/${item}`}
                className="mega-menu-item"
                onClick={closeMenu}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}

      {openMenu === "actor" && (
        <div className="actor-panel">
          <div className="container actor-grid">
            {loadingActors ? (
              <p>Đang tải...</p>
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
      )}
    </header>
  );
}
