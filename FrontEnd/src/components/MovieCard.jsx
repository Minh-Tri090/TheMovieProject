import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { useFavorites } from '../context/FavoriteContext';

export default function MovieCard({ movie }) {
	const { toggleFavorite, isFavorite } = useFavorites() || {};
	const favorite = isFavorite ? isFavorite(movie.id) : false;
	const navigate = useNavigate();

	const handleCardClick = (e) => {
		if (e.target.closest && e.target.closest('.movie-fav-btn')) return;
		navigate(`/movie/${movie.id}`);
	};

	return (
		<div className="movie-card" onClick={handleCardClick} role="button" tabIndex={0}>
			<button
				type="button"
				className={`movie-fav-btn ${favorite ? 'movie-fav-btn-active' : ''}`}
				onClick={(e) => {
					e.stopPropagation();
					toggleFavorite && toggleFavorite(movie);
				}}
				aria-label={favorite ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
			>
				<span aria-hidden>❤️</span>
				{favorite ? <AiFillHeart /> : <FiHeart />}
			</button>
			<img src={movie.poster} alt={movie.title} />
			<div className="movie-meta">
				<h3>{movie.title}</h3>
				<p>
					{movie.year} • {movie.rating}
				</p>
			</div>
		</div>
	);
}

