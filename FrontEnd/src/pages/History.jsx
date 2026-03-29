import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserHistory, getAllHistory, deleteHistoryItem, clearAllHistory } from "../services/api";
import { toast } from "../utils/toast";
import Swal from "sweetalert2";
import "../styles/History.css";

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  const fetchHistories = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = activeTab === "personal"
        ? await getUserHistory()
        : await getAllHistory();
      setHistories(data);
    } catch (err) {
      console.error("Lỗi tải lịch sử:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Xóa khỏi lịch sử?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
      background: "#1e293b",
      color: "#fff",
    });
    if (!result.isConfirmed) return;
    const ok = await deleteHistoryItem(id);
    if (ok) {
      setHistories((prev) => prev.filter((h) => h._id !== id));
      toast.success("Đã xóa khỏi lịch sử");
    }
  };

  const handleClearAll = async () => {
    const result = await Swal.fire({
      title: "Xóa toàn bộ lịch sử?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa tất cả",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
      background: "#1e293b",
      color: "#fff",
    });
    if (!result.isConfirmed) return;
    const ok = await clearAllHistory();
    if (ok) {
      setHistories([]);
      toast.info("Đã xóa toàn bộ lịch sử xem");
    }
  };

  const handleCardClick = (history) => {
    const target = history.movieId
      ? `/movie/${history.movieId}`
      : history.tmdbId
        ? `/movie/${history.tmdbId}`
        : null;
    if (target) navigate(target);
  };

  const getStatusLabel = (progress) => {
    if (progress >= 90) return { label: "Đã xem xong", color: "#22c55e" };
    if (progress > 0) return { label: "Đang xem", color: "#f59e0b" };
    return { label: "Đã xem", color: "#94a3b8" };
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  if (!user) {
    return (
      <div className="history-container">
        <div className="history-empty">
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔐</div>
          <p>Vui lòng <span style={{ color: "#f5c518", cursor: "pointer" }} onClick={() => navigate("/login")}>đăng nhập</span> để xem lịch sử</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-header">
        <div className="history-header-left">
          <h1>🕐 Lịch Sử Xem Phim</h1>
          <p className="history-subtitle">
            {histories.length > 0
              ? `${histories.length} bộ phim trong lịch sử`
              : "Chưa có lịch sử xem"}
          </p>
        </div>
        {histories.length > 0 && activeTab === "personal" && (
          <button className="btn-clear" onClick={handleClearAll}>
            🗑️ Xóa tất cả
          </button>
        )}
      </div>

      {/* Tabs cho Admin */}
      {user?.role === "admin" && (
        <div className="history-tabs">
          <button
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            📋 Lịch Sử Của Tôi
          </button>
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            👥 Tất Cả Người Dùng
          </button>
        </div>
      )}

      {/* Filter badges */}
      {histories.length > 0 && (
        <div className="history-filter-row">
          <span className="hf-badge hf-watching">
            ▶ Đang xem: {histories.filter(h => h.progress > 0 && h.progress < 90).length}
          </span>
          <span className="hf-badge hf-done">
            ✓ Đã xem xong: {histories.filter(h => h.progress >= 90).length}
          </span>
          <span className="hf-badge hf-visited">
            👁 Đã ghé xem: {histories.filter(h => !h.progress || h.progress === 0).length}
          </span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="history-loading">
          <div className="history-spinner" />
          <p>Đang tải lịch sử...</p>
        </div>
      ) : histories.length === 0 ? (
        <div className="history-empty">
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎬</div>
          <p style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Chưa có lịch sử xem</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>Hãy xem một bộ phim nào đó để bắt đầu!</p>
          <button
            onClick={() => navigate("/")}
            style={{ marginTop: "20px", padding: "10px 24px", background: "#f5c518", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
          >
            Khám phá phim
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {histories.map((history) => {
            const status = getStatusLabel(history.progress || 0);
            return (
              <div
                key={history._id}
                className="history-card"
                onClick={() => handleCardClick(history)}
              >
                {/* Poster */}
                <div className="history-poster">
                  {history.moviePoster ? (
                    <img src={history.moviePoster} alt={history.movieTitle} />
                  ) : (
                    <div className="history-poster-placeholder">🎬</div>
                  )}

                  {/* Progress bar */}
                  {history.progress > 0 && (
                    <div className="history-progress-bar">
                      <div
                        className="history-progress-fill"
                        style={{ width: `${Math.min(history.progress, 100)}%` }}
                      />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="history-status-badge" style={{ background: status.color }}>
                    {status.label}
                  </div>

                  {/* Delete button */}
                  <button
                    className="history-delete-btn"
                    onClick={(e) => handleDeleteItem(e, history._id)}
                    title="Xóa khỏi lịch sử"
                  >
                    ×
                  </button>
                </div>

                {/* Info */}
                <div className="history-info">
                  <h3 title={history.movieTitle}>{history.movieTitle}</h3>
                  {activeTab === "all" && history.user && (
                    <p className="history-user">👤 {history.user.name || "Người dùng"}</p>
                  )}
                  <p className="history-date">🕐 {formatDate(history.viewedAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
