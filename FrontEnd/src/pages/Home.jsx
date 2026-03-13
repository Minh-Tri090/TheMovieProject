import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getMovies, addCustomMovie } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [query, setQuery] = useState('');
	const [showAdd, setShowAdd] = useState(false);
	const [draft, setDraft] = useState({ title: '', year: '', rating: '', poster: '', overview: '' });
	const { user } = useAuth() || {};

	useEffect(() => {
		let mounted = true;
		getMovies()
			.then((data) => {
				if (!mounted) return;
				setMovies(data || []);
				setLoading(false);
			})
			.catch(() => {
				if (!mounted) return;
				setError('Không thể tải danh sách phim.');
				setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

	const filtered = movies.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));
	const featured = !query && filtered.length > 0 ? filtered[0] : null;
	const list = featured ? filtered.slice(1) : filtered;

	return (
		<main className="site-main">
			<div className="container">
				<section className="surface home-surface">
					<div className="home-header">
						<div className="home-title-block">
							<h1>Khám phá thế giới phim hôm nay</h1>
							<p className="page-subtitle">
								Các bộ phim đang được xem nhiều nhất trên TheMovie.
							</p>
							<div className="home-chips">
								<span className="chip">Tổng: {movies.length}</span>
								{featured && <span className="chip">Gợi ý cho bạn</span>}
							</div>
						</div>

						<div className="home-search-wrapper">
							<input
								className="input"
								aria-label="Tìm kiếm phim"
								placeholder="Lọc nhanh theo tên phim trong danh sách..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							{user && (
								<button
									type="button"
									className="home-add-btn"
									onClick={() => setShowAdd((v) => !v)}
								>
									{showAdd ? 'Đóng thêm phim' : 'Thêm phim (Admin)'}
								</button>
							)}
						</div>
					</div>

					{showAdd && (
						<div className="home-add-form">
							<div className="home-add-grid">
								<label className="form-field">
									<span>Tiêu đề</span>
									<input
										className="input"
										value={draft.title}
										onChange={(e) => setDraft({ ...draft, title: e.target.value })}
									/>
								</label>
								<label className="form-field">
									<span>Năm</span>
									<input
										className="input"
										value={draft.year}
										onChange={(e) => setDraft({ ...draft, year: e.target.value })}
									/>
								</label>
								<label className="form-field">
									<span>Rating</span>
									<input
										className="input"
										value={draft.rating}
										onChange={(e) => setDraft({ ...draft, rating: e.target.value })}
									/>
								</label>
								<label className="form-field">
									<span>Poster URL</span>
									<input
										className="input"
										value={draft.poster}
										onChange={(e) => setDraft({ ...draft, poster: e.target.value })}
									/>
								</label>
							</div>
							<label className="form-field" style={{ marginTop: 12 }}>
								<span>Mô tả</span>
								<textarea
									className="input home-add-textarea"
									value={draft.overview}
									onChange={(e) => setDraft({ ...draft, overview: e.target.value })}
								/>
							</label>
							<button
								type="button"
								onClick={() => {
									const created = addCustomMovie({
										title: draft.title,
										year: draft.year,
										rating: draft.rating ? Number(draft.rating) : null,
										poster: draft.poster,
										overview: draft.overview
									});
									setMovies((prev) => [created, ...prev]);
									setDraft({ title: '', year: '', rating: '', poster: '', overview: '' });
									setShowAdd(false);
								}}
							>
								Lưu phim mới
							</button>
						</div>
					)}

					{featured && (
						<div className="home-hero">
							<div className="home-hero-poster">
								<img src={featured.poster} alt={featured.title} />
							</div>
							<div className="home-hero-content">
								<h2>{featured.title}</h2>
								<p className="home-hero-meta">
									{featured.year && <span>{featured.year}</span>}
									{featured.rating && <span>★ {featured.rating}/10</span>}
								</p>
								<p className="home-hero-overview">{featured.overview}</p>
							</div>
						</div>
					)}

					{loading && <div className="page-section alert alert-info">Đang tải danh sách phim...</div>}
					{error && <div className="page-section alert alert-error">{error}</div>}

					<div className="page-section movie-grid">
						{list.length === 0 && !loading ? (
							<p className="text-muted">Không tìm thấy phim phù hợp với từ khóa.</p>
						) : (
							list.map((m) => <MovieCard key={m.id} movie={m} />)
						)}
					</div>
				</section>
			</div>
		</main>
	);
}

