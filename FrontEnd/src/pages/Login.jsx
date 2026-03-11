import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await login(email, password);
			navigate('/');
		} catch (err) {
			setError(err.message || 'Đăng nhập thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="site-main">
			<div className="container" style={{ maxWidth: 420 }}>
				<section className="surface">
					<div className="page-heading">
						<div>
							<h1>Đăng nhập</h1>
							<p className="page-subtitle">Tiếp tục khám phá thế giới phim với tài khoản của bạn.</p>
						</div>
					</div>
					<form onSubmit={handleSubmit} className="form">
						<label className="form-field">
							<span>Email</span>
							<input
								className="input"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</label>
						<label className="form-field">
							<span>Mật khẩu</span>
							<input
								className="input"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={4}
							/>
						</label>
						{error && <div className="alert alert-error">{error}</div>}
						<button type="submit" disabled={loading}>
							{loading ? 'Đang xử lý...' : 'Đăng nhập'}
						</button>
					</form>
					<p className="page-section text-muted">
						Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
					</p>
				</section>
			</div>
		</main>
	);
}

