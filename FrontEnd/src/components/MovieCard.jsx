import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { useFavorites } from '../context/FavoriteContext';

export default function MovieCard({ movie }) {
	const { toggleFavorite, isFavorite } = useFavorites() || {};
	const favorite = isFavorite ? isFavorite(movie.id) : false;
	const navigate = useNavigate();

	const [isHovered, setIsHovered] = useState(false);
	const [rect, setRect] = useState(null);
	const hoverTimer = useRef(null);
	const cardRef = useRef(null);

	const handleMouseEnter = () => {
		hoverTimer.current = setTimeout(() => {
			if (cardRef.current) {
				setRect(cardRef.current.getBoundingClientRect());
			}
			setIsHovered(true);
		}, 1000);
	};

	const handleMouseLeave = () => {
		if (hoverTimer.current) clearTimeout(hoverTimer.current);
		setIsHovered(false);
	};

	const handleCardClick = (e) => {
		if (e.target.closest && e.target.closest('.movie-fav-btn')) return;
		navigate(`/movie/${movie.id}`);
	};

	return (
		<div 
			className="movie-card-wrapper" 
			ref={cardRef}
			onMouseEnter={handleMouseEnter} 
			onMouseLeave={handleMouseLeave}
			style={{ position: 'relative', height: '100%', zIndex: isHovered ? 50 : 1 }}
		>
			<div className="movie-card" onClick={handleCardClick} role="button" tabIndex={0} style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s ease' }}>
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

			{isHovered && rect && createPortal(
				<div 
					className="movie-popover" 
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					style={{ 
						position: 'fixed', 
						top: rect.top + rect.height / 2, 
						left: rect.left + rect.width / 2, 
						zIndex: 999999 
					}}
				>
					<img 
						className="popover-backdrop" 
						src={movie.backdrop || movie.poster} 
						alt={movie.title} 
						onClick={() => navigate(`/movie/${movie.id}`)}
						loading="lazy"
					/>
					<div className="popover-content">
						<h3 className="popover-title">{movie.title}</h3>
						
						<div className="popover-actions">
							<button className="btn-play-sm" onClick={() => navigate(`/watch/${movie.id}`)}>
								▶ Xem ngay
							</button>
							<button className="btn-action-sm" onClick={() => toggleFavorite && toggleFavorite(movie)}>
								{favorite ? <AiFillHeart /> : <FiHeart />} Thích
							</button>
							<button className="btn-action-sm" onClick={() => navigate(`/movie/${movie.id}`)}>
								ⓘ Chi tiết
							</button>
						</div>

						<div className="popover-tags">
							<span className="p-badge imdb">IMDb {movie.rating || 'N/A'}</span>
							<span className="p-badge age">T16</span>
							<span className="p-text">{movie.year || '2024'}</span>
							<span className="p-text">Mới cập nhật</span>
						</div>
					</div>
				</div>,
				document.body
			)}
		</div>
	);
}

