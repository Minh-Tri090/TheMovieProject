/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => getCurrentUser());

	const login = (email, password) => {
		const u = authLogin(email, password);
		setUser(u);
		return u;
	};

	const logout = () => {
		authLogout();
		setUser(null);
	};

	const register = ({ name, email, password }) => {
		const u = authRegister({ name, email, password });
		setUser(u);
		return u;
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}

