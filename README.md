# 🎬 TheMovie - Ứng dụng xem phim trực tuyến

Một ứng dụng web hiện đại cho phép người dùng khám phá, tìm kiếm và theo dõi phim yêu thích. Ứng dụng này sử dụng công nghệ MERN stack (MongoDB, Express, React, Node.js) với các tính năng xác thực người dùng, lịch sử xem, và quản lý yêu thích.

## ✨ Các tính năng chính

- ✅ Xác thực người dùng (đăng ký, đăng nhập, JWT)
- ✅ Duyệt và tìm kiếm phim
- ✅ Xem chi tiết phim (trailer, diễn viên, đánh giá)
- ✅ Thêm phim vào yêu thích
- ✅ Lịch sử xem phim
- ✅ Bình luận trên phim
- ✅ Chế độ Kids Mode
- ✅ Giao diện đáp ứng (Responsive UI)

## 📋 Yêu cầu hệ thống

- **Node.js**: v18+
- **MongoDB**: v5.0+
- **npm**: v9+

## 🛠️ Công nghệ sử dụng

### Backend

| Công nghệ  | Phiên bản | Mục đích                |
| ---------- | --------- | ----------------------- |
| Node.js    | >= 18     | JavaScript runtime      |
| Express.js | -         | Web framework           |
| MongoDB    | >= 5.0    | NoSQL database          |
| Mongoose   | -         | MongoDB ODM             |
| JWT        | -         | Xác thực token          |
| bcryptjs   | -         | Mã hóa mật khẩu         |
| dotenv     | -         | Quản lý biến môi trường |
| CORS       | -         | Cross-origin requests   |

### Frontend

| Công nghệ        | Phiên bản | Mục đích     |
| ---------------- | --------- | ------------ |
| React            | 18+       | UI library   |
| Vite             | -         | Build tool   |
| React Router DOM | -         | Định tuyến   |
| Axios            | -         | HTTP client  |
| TailwindCSS      | -         | Styling      |
| SweetAlert2      | -         | Thông báo    |
| React Icons      | -         | Icon library |
| ESLint           | -         | Code linting |

## 📁 Cấu trúc thư mục

```
TheMovieProject/
├── BackEnd/
│   ├── config/           # Cấu hình (database)
│   ├── controllers/      # Logic xử lý request
│   ├── middleware/       # Middleware (xác thực, lỗi)
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Hàm tiện ích
│   ├── app.js           # Express app setup
│   ├── server.js        # Entry point
│   └── package.json
├── FrontEnd/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Trang chính
│   │   ├── context/      # Context API
│   │   ├── services/     # API services
│   │   ├── utils/        # Hàm tiện ích
│   │   ├── styles/       # CSS files
│   │   └── App.jsx       # Main component
│   ├── public/           # Static files
│   ├── vite.config.js    # Vite configuration
│   └── package.json
└── README.md
```

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd TheMovieProject
```

### 2. Cài đặt Backend

#### a. Điều chỉnh các biến môi trường

Tạo file `.env` trong thư mục `BackEnd/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/themoviedb
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

#### b. Cài đặt dependencies

```bash
cd BackEnd
npm install
```

#### c. Chạy Backend

```bash
# Development mode (với nodemon)
npm run dev

# Hoặc chạy với Node.js
node server.js
```

Backend sẽ chạy ở: **http://localhost:5000**

### 3. Cài đặt Frontend

#### a. Điều chỉnh các biến môi trường

Tạo file `.env` trong thư mục `FrontEnd/`:

```env
VITE_TMDB_API_KEY=7e53636ceb00490e8cf14bef210310e7
VITE_API_BASE_URL=http://localhost:5000/api
```

#### b. Cài đặt dependencies

```bash
cd FrontEnd
npm install
```

#### c. Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy ở: **http://localhost:5173**

## 🌐 Truy cập ứng dụng

| Dịch vụ     | URL                       |
| ----------- | ------------------------- |
| Frontend    | http://localhost:5173     |
| Backend API | http://localhost:5000/api |

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Movies

- `GET /api/movies` - Lấy danh sách phim
- `GET /api/movies/:id` - Chi tiết phim
- `GET /api/movies/search?q=...` - Tìm kiếm phim

### User

- `GET /api/user/profile` - Hồ sơ người dùng
- `PUT /api/user/profile` - Cập nhật hồ sơ

### Favorites

- `GET /api/user/favorites` - Danh sách phim yêu thích
- `POST /api/favorites` - Thêm vào yêu thích
- `DELETE /api/favorites/:movieId` - Xóa khỏi yêu thích

### History

- `GET /api/history` - Lịch sử xem
- `POST /api/history` - Thêm vào lịch sử

### Comments

- `GET /api/comments/:movieId` - Bình luận phim
- `POST /api/comments` - Thêm bình luận
- `DELETE /api/comments/:id` - Xóa bình luận

## 📝 Ví dụ sử dụng

### Đăng ký

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user123",
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Đăng nhập

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## 🐛 Khắc phục sự cố

| Vấn đề              | Giải pháp                                             |
| ------------------- | ----------------------------------------------------- |
| Lỗi kết nối MongoDB | Kiểm tra MongoDB daemon có chạy, kiểm tra MONGODB_URI |
| CORS error          | Xác nhận CORS_ORIGIN trong .env khớp với URL frontend |
| API không phản hồi  | Kiểm tra backend có đang chạy ở http://localhost:5000 |
| Module not found    | Chạy `npm install` lại trong cả BackEnd và FrontEnd   |

## 📚 Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
