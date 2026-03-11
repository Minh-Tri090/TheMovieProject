import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

if (!API_KEY) {
	// eslint-disable-next-line no-console
	console.warn('Thiếu VITE_TMDB_API_KEY. Hãy tạo FrontEnd/.env và đặt VITE_TMDB_API_KEY=<your_key>.');
}

function normalizeMovie(tmdbMovie) {
	if (!tmdbMovie) return null;

	return {
		id: tmdbMovie.id,
		title: tmdbMovie.title || tmdbMovie.name || 'Untitled',
		year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : '',
		rating: tmdbMovie.vote_average ? Number(tmdbMovie.vote_average.toFixed(1)) : null,
		poster: tmdbMovie.poster_path ? `${IMAGE_BASE}${tmdbMovie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image',
		overview: tmdbMovie.overview || 'Không có mô tả.',
		raw: tmdbMovie
	};
}

const client = axios.create({
	baseURL: BASE_URL,
	params: {
		api_key: API_KEY,
		language: 'vi-VN'
	}
});

export async function getMovies() {
	const res = await client.get('/movie/popular');
	return (res.data.results || []).map(normalizeMovie);
}

export async function searchMovies(query) {
	if (!query) return getMovies();
	const res = await client.get('/search/movie', {
		params: {
			query
		}
	});
	return (res.data.results || []).map(normalizeMovie);
}

export async function getMovieById(id) {
	const res = await client.get(`/movie/${id}`);
	return normalizeMovie(res.data);
}

export async function getTrendingPeople() {
	const res = await client.get('/trending/person/week');
	return (res.data.results || []).map((p) => ({
		id: p.id,
		name: p.name,
		avatar: p.profile_path ? `${IMAGE_BASE}${p.profile_path}` : 'https://via.placeholder.com/300x450?text=No+Image'
	}));
}

