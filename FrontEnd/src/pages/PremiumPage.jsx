import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";
import "./PremiumPage.css";

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState("Cơ bản"); // Default selection
  const navigate = useNavigate();
  const { user, upgradeToPremium } = useAuth() || {};

  useEffect(() => {
    window.scrollTo(0, 0); // cuộn lên đầu trang khi vào
  }, []);

  return (
    <div className="container page-section">
      <div className="premium-page-container">
        
        <h2 className="premium-title">Chọn gói dịch vụ phù hợp với bạn</h2>
        
        <div className="premium-plans">
          {/* Gói Di động */}
          <div 
            className={`plan-card ${selectedPlan === "Di động" ? "plan-card-selected" : ""}`}
            onClick={() => setSelectedPlan("Di động")}
          >
            <div className="plan-header bg-mobile">
              <h3>Di động</h3>
              <p>480p</p>
              {selectedPlan === "Di động" && <FiCheck className="premium-check" />}
            </div>
            <div className="plan-body">
              <div className="plan-feature">
                <span className="feature-label">Giá hàng tháng</span>
                <span className="feature-value text-bold">74.000 ₫</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Chất lượng hình và âm</span>
                <span className="feature-value text-bold">Khá</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Độ phân giải</span>
                <span className="feature-value text-bold">480p</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Thiết bị được hỗ trợ</span>
                <span className="feature-value text-bold">Điện thoại di động, máy tính bảng</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị mà gia đình bạn có thể xem cùng lúc</span>
                <span className="feature-value text-bold">1</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị được tải xuống</span>
                <span className="feature-value text-bold">1</span>
              </div>
             </div>
          </div>

          {/* Gói Cơ bản */}
          <div 
            className={`plan-card ${selectedPlan === "Cơ bản" ? "plan-card-selected" : ""}`}
            onClick={() => setSelectedPlan("Cơ bản")}
          >
            <div className="plan-header bg-basic">
              <h3>Cơ bản</h3>
              <p>720p</p>
              {selectedPlan === "Cơ bản" && <FiCheck className="premium-check" />}
            </div>
            <div className="plan-body">
              <div className="plan-feature">
                <span className="feature-label">Giá hàng tháng</span>
                <span className="feature-value text-bold">114.000 ₫</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Chất lượng hình và âm</span>
                <span className="feature-value text-bold">Tốt</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Độ phân giải</span>
                <span className="feature-value text-bold">720p (HD)</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Thiết bị được hỗ trợ</span>
                <span className="feature-value text-bold">TV, máy tính, điện thoại di động, máy tính bảng</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị mà gia đình bạn có thể xem cùng lúc</span>
                <span className="feature-value text-bold">1</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị được tải xuống</span>
                <span className="feature-value text-bold">1</span>
              </div>
             </div>
          </div>

          {/* Gói Tiêu chuẩn */}
          <div 
            className={`plan-card ${selectedPlan === "Tiêu chuẩn" ? "plan-card-selected" : ""}`}
            onClick={() => setSelectedPlan("Tiêu chuẩn")}
          >
            <div className="plan-header bg-standard">
              <h3>Tiêu chuẩn</h3>
              <p>1080p</p>
              {selectedPlan === "Tiêu chuẩn" && <FiCheck className="premium-check" />}
            </div>
            <div className="plan-body">
              <div className="plan-feature">
                <span className="feature-label">Giá hàng tháng</span>
                <span className="feature-value text-bold">231.000 ₫</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Chất lượng hình và âm</span>
                <span className="feature-value text-bold">Tuyệt vời</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Độ phân giải</span>
                <span className="feature-value text-bold">1080p (Full HD)</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Thiết bị được hỗ trợ</span>
                <span className="feature-value text-bold">TV, máy tính, điện thoại di động, máy tính bảng</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị mà gia đình bạn có thể xem cùng lúc</span>
                <span className="feature-value text-bold">2</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị được tải xuống</span>
                <span className="feature-value text-bold">2</span>
              </div>
             </div>
          </div>

          {/* Gói Cao cấp */}
          <div 
            className={`plan-card plan-card-premium ${selectedPlan === "Cao cấp" ? "plan-card-selected" : ""}`}
            onClick={() => setSelectedPlan("Cao cấp")}
          >
            <div className="premium-badge">Phổ biến nhất</div>
            <div className="plan-header bg-premium">
              <h3>Cao cấp</h3>
              <p>4K + HDR</p>
              {selectedPlan === "Cao cấp" && <FiCheck className="premium-check" />}
            </div>
            <div className="plan-body">
              <div className="plan-feature">
                <span className="feature-label">Giá hàng tháng</span>
                <span className="feature-value text-bold">273.000 ₫</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Chất lượng hình và âm</span>
                <span className="feature-value text-bold">Tốt nhất</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Độ phân giải</span>
                <span className="feature-value text-bold">4K (Ultra HD) + HDR</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Âm thanh không gian (âm thanh chân thực)</span>
                <span className="feature-value text-bold">Đã bao gồm</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Thiết bị được hỗ trợ</span>
                <span className="feature-value text-bold">TV, máy tính, điện thoại di động, máy tính bảng</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị mà gia đình bạn có thể xem cùng lúc</span>
                <span className="feature-value text-bold">4</span>
              </div>
              <hr />
              <div className="plan-feature">
                <span className="feature-label">Số thiết bị được tải xuống</span>
                <span className="feature-value text-bold">6</span>
              </div>
             </div>
          </div>
        </div>

        <div className="premium-footer">
          <p>
            Việc bạn có thể xem ở chế độ HD (720p), Full HD (1080p), Ultra HD (4K) và HDR hay không phụ thuộc vào dịch vụ internet và khả năng của thiết bị. Không phải tất cả nội dung đều có sẵn ở mọi độ phân giải. Xem Điều khoản sử dụng của chúng tôi để biết thêm chi tiết.
          </p>
          <p>
            Chỉ những người sống cùng bạn mới có thể dùng tài khoản của bạn. Xem trên 4 thiết bị khác nhau cùng lúc với gói Cao cấp, 2 với gói Tiêu chuẩn và 1 với gói Cơ bản và Di động.
          </p>
          <p>
            Các sự kiện trực tiếp được cung cấp trong mọi gói dịch vụ Netflix và có chứa quảng cáo.
          </p>
          
          <button 
            className="premium-next-btn"
            onClick={() => {
              if (!user) {
                toast.error("Vui lòng đăng nhập để đăng ký gói Premium!");
                navigate('/login');
                return;
              }
              if (user.role === 'premium' || user.role === 'admin') {
                toast.info("Tài khoản của bạn đã là Premium!");
                return;
              }
              upgradeToPremium();
              toast.success("Chúc mừng! Tài khoản đã nâng cấp thành Premium 🌟");
              navigate('/');
            }}
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  );
}
