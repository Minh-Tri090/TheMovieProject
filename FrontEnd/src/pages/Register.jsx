import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await register({ name, email, password });
			navigate('/');
		} catch (err) {
			setError(err.message || 'Đăng ký thất bại');
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
							<h1>Tạo tài khoản</h1>
							<p className="page-subtitle">Đăng ký nhanh để lưu lại những bộ phim bạn yêu thích.</p>
						</div>
					</div>
					<form onSubmit={handleSubmit} className="form">
						<label className="form-field">
							<span>Họ tên</span>
							<input
								className="input"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</label>
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
							{loading ? 'Đang xử lý...' : 'Đăng ký'}
						</button>
					</form>
					<p className="page-section text-muted">
						Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
					</p>
				</section>
			</div>
		</main>
	);
}

