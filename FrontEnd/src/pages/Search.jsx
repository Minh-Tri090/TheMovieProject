import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/api';

export default function Search() {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');

	const location = useLocation();
	const mode = location.state?.mode || 'default';

	const titleByMode = {
		default: 'Tìm kiếm phim',
		topic: 'Khám phá theo chủ đề',
		genre: 'Tìm theo thể loại',
		single: 'Phim lẻ nổi bật',
		series: 'Phim bộ hay',
		together: 'Xem phim cùng bạn bè',
		country: 'Phim theo quốc gia',
		actor: 'Tìm phim theo diễn viên',
		schedule: 'Lịch chiếu & phim sắp ra mắt',
		reviews: 'Khám phá reviews phim',
	};

	const subtitleByMode = {
		default: 'Nhập tên phim bạn muốn tìm. Kết quả sẽ hiển thị theo thời gian thực.',
		topic: 'Chọn hoặc nhập chủ đề bạn quan tâm (hành động, tình cảm, gia đình,...).',
		genre: 'Nhập thể loại hoặc tên phim thuộc thể loại bạn muốn xem.',
		single: 'Gợi ý các phim lẻ dễ xem nhanh trong một buổi.',
		series: 'Tìm các bộ phim nhiều tập để cày vào cuối tuần.',
		together: 'Gợi ý phim phù hợp để xem chung với bạn bè hoặc người thân.',
		country: 'Nhập tên quốc gia hoặc vùng miền để lọc phim.',
		actor: 'Nhập tên diễn viên bạn yêu thích để tìm các phim liên quan.',
		schedule: 'Xem danh sách phim đang chiếu và sắp chiếu (dựa trên dữ liệu hiện có).',
		reviews: 'Tìm phim theo đánh giá, bình luận và độ nổi tiếng.',
	};

	const placeholderByMode = {
		default: 'Ví dụ: Avengers, Inception...',
		topic: 'Ví dụ: Siêu anh hùng, Tình cảm gia đình...',
		genre: 'Ví dụ: Action, Drama, Comedy...',
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
		searchMovies('')
			.then((data) => {
				if (!mounted) return;
				setMovies(data);
				setLoading(false);
			})
			.catch(() => {
				if (!mounted) return;
				setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

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

					<div className="page-section" style={{ maxWidth: 480 }}>
						<input
							className="input"
							placeholder={placeholderByMode[mode] ?? placeholderByMode.default}
							value={query}
							onChange={handleChange}
						/>
					</div>

					{loading && <div className="page-section alert alert-info">Đang tìm phim...</div>}

					<div className="page-section movie-grid">
						{!loading && movies.map((m) => <MovieCard key={m.id} movie={m} />)}
					</div>
				</section>
			</div>
		</main>
	);
}

