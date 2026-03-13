import React from 'react';
import { useFavorites } from '../context/FavoriteContext';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
	const { favorites } = useFavorites() || { favorites: [] };

	return (
		<main className="site-main">
			<div className="container">
				<section className="surface">
					<div className="page-heading">
						<div>
							<h1>Phim yêu thích</h1>
							<p className="page-subtitle">Danh sách các bộ phim bạn đã đánh dấu ❤️.</p>
						</div>
					</div>

					<div className="page-section movie-grid">
						{favorites.length === 0 ? (
							<p className="text-muted">Chưa có phim nào trong danh sách yêu thích.</p>
						) : (
							favorites.map((m) => <MovieCard key={m.id} movie={m} />)
						)}
					</div>
				</section>
			</div>
		</main>
	);
}

