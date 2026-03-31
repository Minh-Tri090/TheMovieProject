# TheMovie

## Công nghệ sử dụng

### BackEnd
- **Node.js**
- **Express.js**
- **MongoDB** (thông qua mongoose)
- **JWT** (jsonwebtoken)
- **bcryptjs**
- **dotenv**
- **cors**
- **nodemon** (dev)

**Các package chính:**
```
"express", "mongoose", "jsonwebtoken", "bcryptjs", "dotenv", "cors", "nodemon"
```

### FrontEnd
- **React**
- **Vite**
- **React Router DOM**
- **Axios**
- **React Icons**
- **SweetAlert2**
- **TailwindCSS**
- **ESLint**

**Các package chính:**
```
"react", "react-dom", "react-router-dom", "axios", "react-icons", "sweetalert2", "tailwindcss", "vite", "eslint"
```

## Hướng dẫn chạy project

### 1. Chạy Backend
```bash
cd BackEnd
npm install
node .\server.js
```

### 2. Chạy Frontend
tạo file .env và copy lệnh dưới đây dán vào file
VITE_TMDB_API_KEY=7e53636ceb00490e8cf14bef210310e7
```bash
cd FrontEnd
npm install
npm run dev
```

### 3. Truy cập
- Mặc định backend chạy ở: http://localhost:5000
- Frontend chạy ở: http://localhost:5173 
