const USERS_KEY = 'themovie_users';
const CURRENT_USER_KEY = 'themovie_current_user';

function loadUsers() {
	try {
		const raw = localStorage.getItem(USERS_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveUsers(users) {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
	try {
		const raw = localStorage.getItem(CURRENT_USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function logout() {
	localStorage.removeItem(CURRENT_USER_KEY);
}

export function login(email, password) {
	const users = loadUsers();
	const user = users.find((u) => u.email === email && u.password === password);
	if (!user) {
		throw new Error('Email hoặc mật khẩu không đúng');
	}
	localStorage.setItem(
		CURRENT_USER_KEY,
		JSON.stringify({ id: user.id, name: user.name, email: user.email })
	);
	return getCurrentUser();
}

export function register({ name, email, password }) {
	const users = loadUsers();
	if (users.some((u) => u.email === email)) {
		throw new Error('Email đã được sử dụng');
	}
	const newUser = {
		id: Date.now(),
		name,
		email,
		password
	};
	const next = [...users, newUser];
	saveUsers(next);
	localStorage.setItem(
		CURRENT_USER_KEY,
		JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email })
	);
	return getCurrentUser();
}

