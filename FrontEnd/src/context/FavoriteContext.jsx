import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFavoriteMovies, addFavoriteMovie, removeFavoriteMovie } from '../services/api';

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
	const [favorites, setFavorites] = useState([]);

	useEffect(() => {
		setFavorites(getFavoriteMovies());
	}, []);

	const add = (movie) => {
		const next = addFavoriteMovie(movie);
		setFavorites(next);
	};

	const remove = (id) => {
		const next = removeFavoriteMovie(id);
		setFavorites(next);
	};

	const toggle = (movie) => {
		if (!movie) return;
		if (favorites.some((m) => m.id === movie.id)) {
			remove(movie.id);
		} else {
			add(movie);
		}
	};

	const isFavorite = (id) => favorites.some((m) => m.id === id);

	return (
		<FavoriteContext.Provider value={{ favorites, addFavorite: add, removeFavorite: remove, toggleFavorite: toggle, isFavorite }}>
			{children}
		</FavoriteContext.Provider>
	);
}

export function useFavorites() {
	return useContext(FavoriteContext);
}

