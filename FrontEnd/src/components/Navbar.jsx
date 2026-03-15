import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getTrendingPeople } from "../services/api";

export default function Navbar() {
  const { user, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const searchRef = useRef(null);
  const [actors, setActors] = useState([]);
  const [loadingActors, setLoadingActors] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (!cancelled) {
          setActors(data.slice(0, 20));
        }
      } finally {
        if (!cancelled) {
          setLoadingActors(false);
        }
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
    if (user) return;
    setError("");
    setLoading(true);
    try {
      if (activeTab === "login") {
        await login(email, password);
      } else {
        await register({ name, email, password });
      }
      setIsPanelOpen(false);
      setPassword("");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="site-header" onMouseLeave={closeMenu}>
      <div className="container site-header-inner header-layout">
        <div
          className="header-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="brand">
            THE<span>MOVIE</span>
          </span>
        </div>
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
                const v = e.target.value;
                setSearchQuery(v);
                navigate(`/search?q=${encodeURIComponent(v)}`);
              }}
              onBlur={() => {
                if (!searchQuery) setSearchOpen(false);
              }}
            />
          )}
        </div>

        <nav className="header-menu">
          <button
            type="button"
            className="header-menu-item"
            onMouseEnter={() => setOpenMenu("topic")} // Rê chuột vào là hiện
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
          <button
            type="button"
            className="header-menu-item"
            onClick={() => navigate("/favorites")}
          >
            Yêu thích
          </button>
        </nav>

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

          {!user && isPanelOpen && (
            <div className="auth-panel">
              <div className="auth-panel-tabs">
                <button
                  type="button"
                  className={`auth-tab ${activeTab === "login" ? "auth-tab-active" : ""}`}
                  onClick={() => {
                    setActiveTab("login");
                    setError("");
                  }}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  className={`auth-tab ${activeTab === "register" ? "auth-tab-active" : ""}`}
                  onClick={() => {
                    setActiveTab("register");
                    setError("");
                  }}
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
                    minLength={4}
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
        </div>
      </div>

      {/* Các menu Panel bổ sung (Topic, Genre, Country, Actor) */}
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
            ].map((topic) => (
              <div key={topic} className="topic-card">
                <div className="topic-card-title">{topic}</div>
                <div className="topic-card-link">Xem toàn bộ &gt;</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ... (Các phần mega-menu khác Huy giữ nguyên nhé) ... */}
    </header>
  );
}
