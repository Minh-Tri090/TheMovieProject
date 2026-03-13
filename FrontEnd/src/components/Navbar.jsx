import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getTrendingPeople } from '../services/api';

export default function Navbar() {
	const { user, login, register, logout } = useAuth();
	const navigate = useNavigate();
	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [openMenu, setOpenMenu] = useState(null);
	const searchRef = useRef(null);
	const [actors, setActors] = useState([]);
	const [loadingActors, setLoadingActors] = useState(false);
	const [activeTab, setActiveTab] = useState('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const toggleMenu = (menu) => {
		setOpenMenu((current) => (current === menu ? null : menu));
	};

	const closeMenu = () => setOpenMenu(null);

	useEffect(() => {
		if (openMenu !== 'actor' || actors.length > 0 || loadingActors) return;
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
		navigate('/');
		setIsPanelOpen(false);
	};

	const togglePanel = () => {
		if (user) return;
		setIsPanelOpen((open) => !open);
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (user) return;
		setError('');
		setLoading(true);
		try {
			if (activeTab === 'login') {
				await login(email, password);
			} else {
				await register({ name, email, password });
			}
			setIsPanelOpen(false);
			setPassword('');
		} catch (err) {
			setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<header className="site-header">
			<div className="container site-header-inner header-layout">
				<div className="header-search">
					{!searchOpen && (
						<button
							type="button"
							className="header-search-button"
							onClick={() => {
								setSearchOpen(true);
								setTimeout(() => searchRef.current && searchRef.current.focus(), 50);
							}}
						>
							<span className="header-search-icon">
								<FiSearch />
							</span>
							<span className="header-search-text">Tìm kiếm phim, diễn viên</span>
						</button>
					)}
					{searchOpen && (
						<input
							ref={searchRef}
							type="search"
							className="header-search-input input"
							placeholder="Tìm kiếm phim, diễn viên..."
							value={searchQuery}
							onChange={(e) => {
								const v = e.target.value;
								setSearchQuery(v);
								navigate(`/search?q=${encodeURIComponent(v)}`);
							}}
							onBlur={() => {
								// keep input open if there's a query, otherwise close
								if (!searchQuery) setSearchOpen(false);
							}}
						/>
					)}
				</div>

				<nav className="header-menu">
					<button type="button" className="header-menu-item" onClick={() => toggleMenu('topic')}>
						Chủ đề
					</button>
					<button type="button" className="header-menu-item" onClick={() => toggleMenu('genre')}>
						Thể loại
					</button>
					<button type="button" className="header-menu-item" onClick={() => toggleMenu('together')}>
						<span className="badge-new">NEW</span> Xem chung
					</button>
					<button type="button" className="header-menu-item" onClick={() => toggleMenu('country')}>
						Quốc gia
					</button>
					<button type="button" className="header-menu-item" onClick={() => toggleMenu('actor')}>
						Diễn viên
					</button>
					<button type="button" className="header-menu-item" onClick={() => navigate('/favorites')}>
						Yêu thích
					</button>
				</nav>

				{openMenu && <button type="button" className="menu-scrim" aria-label="Đóng menu" onClick={closeMenu} />}

				{openMenu === 'topic' && (
					<div className="topic-strip">
						<div className="topic-strip-inner">
							<div className="topic-card">
								<div className="topic-card-title">Viễn Tưởng</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
							<div className="topic-card">
								<div className="topic-card-title">Thái Lan</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
							<div className="topic-card">
								<div className="topic-card-title">Sitcom</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
							<div className="topic-card">
								<div className="topic-card-title">Chiếu Rạp</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
							<div className="topic-card">
								<div className="topic-card-title">Kinh Dị</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
							<div className="topic-card">
								<div className="topic-card-title">Cổ Trang</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
							<div className="topic-card">
								<div className="topic-card-title">4K</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
							<div className="topic-card">
								<div className="topic-card-title">Chiến Tranh</div>
								<div className="topic-card-link">Xem toàn bộ &gt;</div>
							</div>
						</div>
					</div>
				)}

				{openMenu === 'genre' && (
					<div className="mega-menu" role="dialog" aria-label="Thể loại">
						<div className="mega-menu-column">
							<button type="button" className="mega-menu-item">Chính kịch</button>
							<button type="button" className="mega-menu-item">Hình Sự</button>
							<button type="button" className="mega-menu-item">Cổ Trang</button>
							<button type="button" className="mega-menu-item">Tài Liệu</button>
							<button type="button" className="mega-menu-item">Chiến Tranh</button>
							<button type="button" className="mega-menu-item">Hoạt hình</button>
							<button type="button" className="mega-menu-item">Sci-Fi</button>
							<button type="button" className="mega-menu-item">Trẻ Em</button>
							<button type="button" className="mega-menu-item">Phim Hài</button>
						</div>
						<div className="mega-menu-column">
							<button type="button" className="mega-menu-item">Hài Hước</button>
							<button type="button" className="mega-menu-item">Kinh Dị</button>
							<button type="button" className="mega-menu-item">Võ Thuật</button>
							<button type="button" className="mega-menu-item">Tâm Lý</button>
							<button type="button" className="mega-menu-item">Thần Thoại</button>
							<button type="button" className="mega-menu-item">Chiếu rạp</button>
							<button type="button" className="mega-menu-item">Fantasy</button>
							<button type="button" className="mega-menu-item">Phim 18+</button>
							<button type="button" className="mega-menu-item">Phim Nhạc</button>
						</div>
						<div className="mega-menu-column">
							<button type="button" className="mega-menu-item">Bí ẩn</button>
							<button type="button" className="mega-menu-item">Phiêu Lưu</button>
							<button type="button" className="mega-menu-item">Short Drama</button>
							<button type="button" className="mega-menu-item">Âm Nhạc</button>
							<button type="button" className="mega-menu-item">Học Đường</button>
							<button type="button" className="mega-menu-item">Action</button>
							<button type="button" className="mega-menu-item">Hành Động</button>
							<button type="button" className="mega-menu-item">Lịch Sử</button>
							<button type="button" className="mega-menu-item">Lãng Mạn</button>
						</div>
						<div className="mega-menu-column">
							<button type="button" className="mega-menu-item">Viễn Tưởng</button>
							<button type="button" className="mega-menu-item">Khoa Học</button>
							<button type="button" className="mega-menu-item">Tình Cảm</button>
							<button type="button" className="mega-menu-item">Thể Thao</button>
							<button type="button" className="mega-menu-item">Kinh Điển</button>
							<button type="button" className="mega-menu-item">Adventure</button>
							<button type="button" className="mega-menu-item">Gia Đình</button>
							<button type="button" className="mega-menu-item">Giả Tưởng</button>
						</div>
					</div>
				)}

				{openMenu === 'country' && (
					<div className="country-dropdown">
						<button type="button" className="country-item">Hàn Quốc</button>
						<button type="button" className="country-item">Thái Lan</button>
						<button type="button" className="country-item">Nhật Bản</button>
						<button type="button" className="country-item">Âu Mỹ</button>
						<button type="button" className="country-item">Hồng Kông</button>
						<button type="button" className="country-item">Trung Quốc</button>
						<button type="button" className="country-item">Anh</button>
						<button type="button" className="country-item">Ấn Độ</button>
					</div>
				)}

				{openMenu === 'actor' && (
					<div className="actor-grid-panel">
						<div className="actor-grid-header">
							<div className="actor-grid-title">Diễn viên nổi bật (TMDB)</div>
						</div>
						{loadingActors && <div className="text-muted">Đang tải danh sách diễn viên...</div>}
						{!loadingActors && (
							<div className="actor-grid">
								{actors.map((a) => (
									<div key={a.id} className="actor-card">
										<img src={a.avatar} alt={a.name} className="actor-avatar" />
										<div className="actor-name">{a.name}</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				<div className="header-member">
					<button
						type="button"
						className="header-member-btn"
						onClick={user ? handleLogout : togglePanel}
					>
						<span className="header-member-icon">
							<FiUser />
						</span>
						<span>{user ? (user.name || user.email) : 'Thành viên'}</span>
					</button>

					{!user && isPanelOpen && (
						<div className="auth-panel">
							<div className="auth-panel-tabs">
								<button
									type="button"
									className={`auth-tab ${activeTab === 'login' ? 'auth-tab-active' : ''}`}
									onClick={() => {
										setActiveTab('login');
										setError('');
									}}
								>
									Đăng nhập
								</button>
								<button
									type="button"
									className={`auth-tab ${activeTab === 'register' ? 'auth-tab-active' : ''}`}
									onClick={() => {
										setActiveTab('register');
										setError('');
									}}
								>
									Đăng ký
								</button>
							</div>
							<form onSubmit={handleSubmit} className="form auth-form">
								{activeTab === 'register' && (
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
										? activeTab === 'login'
											? 'Đang đăng nhập...'
											: 'Đang đăng ký...'
										: activeTab === 'login'
										? 'Đăng nhập'
										: 'Đăng ký'}
								</button>
							</form>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

