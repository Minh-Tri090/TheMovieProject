import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies, getMoviesByGenre, getMoviesByCountry } from '../services/api';

export default function Search({ mode: propMode }) {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');

	const location = useLocation();
	const { name } = useParams();
	const mode = propMode || location.state?.mode || 'default';

	// read query param `q` from URL; if present we hide the page input and use it
	const urlParams = new URLSearchParams(location.search);
	const urlQuery = urlParams.get('q') || '';

	const titleByMode = {
		default: urlQuery ? `Kết quả cho "${urlQuery}"` : 'Tìm kiếm phim',
		topic: 'Khám phá theo chủ đề',
		genre: name ? `Thể loại: ${name}` : 'Tìm theo thể loại',
		single: 'Phim lẻ nổi bật',
		series: 'Phim bộ hay',
		together: 'Xem phim cùng bạn bè',
		country: name ? `Phim ${name}` : 'Phim theo quốc gia',
		actor: 'Tìm phim theo diễn viên',
		schedule: 'Lịch chiếu & phim sắp ra mắt',
		reviews: 'Khám phá reviews phim',
	};

	const subtitleByMode = {
		default: 'Nhập tên phim bạn muốn tìm. Kết quả sẽ hiển thị theo thời gian thực.',
		topic: 'Chọn hoặc nhập chủ đề bạn quan tâm (hành động, tình cảm, gia đình,...).',
		genre: name ? `Danh sách phim thuộc thể loại ${name} cập nhật mới nhất.` : 'Nhập thể loại hoặc tên phim thuộc thể loại bạn muốn xem.',
		single: 'Gợi ý các phim lẻ dễ xem nhanh trong một buổi.',
		series: 'Tìm các bộ phim nhiều tập để cày vào cuối tuần.',
		together: 'Gợi ý phim phù hợp để xem chung với bạn bè hoặc người thân.',
		country: name ? `Tất cả phim từ ${name} đang có trên hệ thống.` : 'Nhập tên quốc gia hoặc vùng miền để lọc phim.',
		actor: 'Nhập tên diễn viên bạn yêu thích để tìm các phim liên quan.',
		schedule: 'Xem danh sách phim đang chiếu và sắp chiếu (dựa trên dữ liệu hiện có).',
		reviews: 'Tìm phim theo đánh giá, bình luận và độ nổi tiếng.',
	};

	const placeholderByMode = {
		default: 'Ví dụ: Avengers, Inception...',
		topic: 'Ví dụ: Siêu anh hùng, Tình cảm gia đình...',
		genre: 'Ví dụ: Hành động, Kinh dị...',
		single: 'Nhập tên phim lẻ bạn muốn xem...',
		series: 'Nhập tên phim bộ bạn muốn xem...',
		together: 'Ví dụ: phim nhẹ nhàng, phim gia đình...',
		country: 'Ví dụ: Việt Nam, Hàn Quốc, Mỹ...',
		actor: 'Ví dụ: Robert Downey Jr, Song Joong Ki...',
		schedule: 'Nhập tên phim bạn muốn xem lịch chiếu...',
		reviews: 'Nhập tên phim để xem reviews...',
	};

	useEffect(() => {
		let mounted = true;
		const activeTerm = name || urlQuery;
		setQuery(activeTerm);
		setLoading(true);

		const fetchData = async () => {
			try {
				let data = [];
				if (mode === 'genre' && name) {
					data = await getMoviesByGenre(name);
				} else if (mode === 'country' && name) {
					data = await getMoviesByCountry(name);
				} else {
					data = await searchMovies(activeTerm);
				}
				
				if (mounted) {
					setMovies(data);
					setLoading(false);
				}
			} catch (err) {
				if (mounted) setLoading(false);
			}
		};

		fetchData();

		return () => {
			mounted = false;
		};
	}, [location.pathname, location.search, name]);

	const handleChange = async (e) => {
		const value = e.target.value;
		setQuery(value);
		if (!value) {
			const data = await searchMovies('');
			setMovies(data);
			return;
		}
		setLoading(true);
		try {
			const data = await searchMovies(value);
			setMovies(data);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="site-main">
			<div className="container">
				<section className="surface">
					<div className="page-heading">
						<div>
							<h1>{titleByMode[mode] ?? titleByMode.default}</h1>
							<p className="page-subtitle">{subtitleByMode[mode] ?? subtitleByMode.default}</p>
						</div>
						<span className="chip">Tổng: {movies.length}</span>
					</div>

					{/* show page input only when there's no query in URL (header search active) */}
					{!urlQuery && (
						<div className="page-section" style={{ maxWidth: 480 }}>
							<input
								className="input"
								placeholder={placeholderByMode[mode] ?? placeholderByMode.default}
								value={query}
								onChange={handleChange}
							/>
						</div>
					)}

					{loading && <div className="page-section alert alert-info">Đang tìm phim...</div>}

					<div className="page-section movie-grid">
						{!loading && movies.map((m) => <MovieCard key={m.id} movie={m} />)}
					</div>
				</section>
			</div>
		</main>
	);
}

