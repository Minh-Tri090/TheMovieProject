import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { backendApi } from "../services/api";
import "../styles/History.css";

export default function History() {
  const { user } = useAuth();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal"); // personal or all (for admin)

  useEffect(() => {
    fetchHistories();
  }, [activeTab, user]);

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "personal" ? "/history/user" : "/history/all";
      const response = await backendApi.get(endpoint);

      if (response.status !== 200) throw new Error("Lỗi khi tải dữ liệu");

      setHistories(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tất cả lịch sử xem?")) return;

    try {
      const response = await backendApi.delete("/history/clear");

      if (response.status === 200) {
        setHistories([]);
        alert("Đã xóa lịch sử xem");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  if (loading) {
    return <div className="history-container">Đang tải...</div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Lịch Sử Xem Phim</h1>
      </div>

      {/* Tabs cho Admin */}
      {user?.role === "admin" && (
        <div className="history-tabs">
          <button
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Lịch Sử Của Tôi
          </button>
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Tất Cả Người Dùng
          </button>
        </div>
      )}

      <div className="history-actions">
        <button className="btn-clear" onClick={clearHistory}>
          Xóa Lịch Sử
        </button>
      </div>

      {/* Hiển thị lịch sử */}
      {histories.length === 0 ? (
        <div className="history-empty">
          <p>Chưa có lịch sử xem phim</p>
        </div>
      ) : (
        <div className="history-grid">
          {histories.map((history) => (
            <div key={history._id} className="history-card">
              <div className="history-poster">
                {history.movie?.poster && (
                  <img src={history.movie.poster} alt={history.movieTitle} />
                )}
              </div>
              <div className="history-info">
                <h3>{history.movieTitle}</h3>
                {activeTab === "all" && (
                  <p className="history-user">
                    👤 {history.user?.name || "Người dùng"}
                  </p>
                )}
                <p className="history-date">
                  📅 {new Date(history.viewedAt).toLocaleString("vi-VN")}
                </p>
                {history.duration > 0 && (
                  <p className="history-duration">
                    ⏱️ {Math.floor(history.duration / 60)} phút
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
