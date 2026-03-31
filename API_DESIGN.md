# 🔌 API Design Documentation

## Mục lục

1. [1. Chức năng Đăng nhập/Đăng ký](#1-chức-năng-đăng-nhập-đăng-ký)
2. [2. Phân quyền Admin/User](#2-phân-quyền-adminuser)
3. [3. Chế độ Trẻ em](#3-chế-độ-trẻ-em)
4. [4. Quản lý Trang Phim Yêu thích](#4-quản-lý-trang-phim-yêu-thích)
5. [5. Danh sách Phim của Diễn viên](#5-danh-sách-phim-của-diễn-viên)

---

## 1. Chức năng Đăng nhập/Đăng ký

### 1.1 Đăng ký tài khoản

| Thành phần         | Chi tiết                         |
| ------------------ | -------------------------------- |
| **Endpoint**       | `/api/auth/register`             |
| **Method**         | `POST`                           |
| **Authentication** | Không yêu cầu                    |
| **Description**    | Đăng ký tài khoản người dùng mới |

**Request Format:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Request Validation:**

- `username`: Bắt buộc, độ dài 3-20 ký tự, không chứa ký tự đặc biệt
- `email`: Bắt buộc, định dạng email hợp lệ, duy nhất trong hệ thống
- `password`: Bắt buộc, tối thiểu 8 ký tự, chứa chữ hoa, chữ thường, số
- `confirmPassword`: Bắt buộc, phải trùng khớp với password

**Response Success (201):**

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

**Response Error (400/409):**

```json
{
  "success": false,
  "message": "Email đã tồn tại trong hệ thống",
  "statusCode": 409
}
```

---

### 1.2 Đăng nhập

| Thành phần         | Chi tiết                         |
| ------------------ | -------------------------------- |
| **Endpoint**       | `/api/auth/login`                |
| **Method**         | `POST`                           |
| **Authentication** | Không yêu cầu                    |
| **Description**    | Xác thực và đăng nhập người dùng |

**Request Format:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Request Validation:**

- `email`: Bắt buộc, định dạng email hợp lệ
- `password`: Bắt buộc, tối thiểu 8 ký tự

**Response Success (200):**

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "kidsMode": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

**Response Error (401):**

```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác",
  "statusCode": 401
}
```

---

### 1.3 Đăng xuất

| Thành phần         | Chi tiết                       |
| ------------------ | ------------------------------ |
| **Endpoint**       | `/api/auth/logout`             |
| **Method**         | `POST`                         |
| **Authentication** | Yêu cầu JWT Token              |
| **Description**    | Đăng xuất tài khoản người dùng |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Format:**

```json
{}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

## 2. Phân quyền Admin/User

### 2.1 Lấy Danh sách Người dùng

| Thành phần         | Chi tiết                                     |
| ------------------ | -------------------------------------------- |
| **Endpoint**       | `/api/users`                                 |
| **Method**         | `GET`                                        |
| **Authentication** | Yêu cầu JWT Token + Role Admin               |
| **Description**    | Lấy danh sách toàn bộ người dùng (chỉ Admin) |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Query Parameters:**

```
?page=1&limit=10&role=user&search=john
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Lấy danh sách người dùng thành công",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "email": "jane@example.com",
        "role": "user",
        "createdAt": "2024-01-20T14:22:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

**Response Error (403):**

```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập tài nguyên này",
  "statusCode": 403
}
```

---

### 2.2 Cập nhật Quyền Người dùng

| Thành phần         | Chi tiết                             |
| ------------------ | ------------------------------------ |
| **Endpoint**       | `/api/users/:userId/role`            |
| **Method**         | `PUT`                                |
| **Authentication** | Yêu cầu JWT Token + Role Admin       |
| **Description**    | Thay đổi quyền (role) của người dùng |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `userId`: ID của người dùng cần cập nhật

**Request Format:**

```json
{
  "role": "admin"
}
```

**Request Validation:**

- `role`: Bắt buộc, giá trị hợp lệ: `"user"` hoặc `"admin"`

**Response Success (200):**

```json
{
  "success": true,
  "message": "Cập nhật quyền thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin",
    "updatedAt": "2024-01-25T15:45:00Z"
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Người dùng không tồn tại",
  "statusCode": 404
}
```

---

### 2.3 Xóa Người dùng

| Thành phần         | Chi tiết                               |
| ------------------ | -------------------------------------- |
| **Endpoint**       | `/api/users/:userId`                   |
| **Method**         | `DELETE`                               |
| **Authentication** | Yêu cầu JWT Token + Role Admin         |
| **Description**    | Xóa tài khoản người dùng khỏi hệ thống |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `userId`: ID của người dùng cần xóa

**Request Format:**

```json
{}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Xóa người dùng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Response Error (403):**

```json
{
  "success": false,
  "message": "Bạn không thể xóa tài khoản admin",
  "statusCode": 403
}
```

---

### 2.4 Thêm Phim (Admin)

| Thành phần         | Chi tiết                       |
| ------------------ | ------------------------------ |
| **Endpoint**       | `/api/movies`                  |
| **Method**         | `POST`                         |
| **Authentication** | Yêu cầu JWT Token + Role Admin |
| **Description**    | Thêm phim mới vào hệ thống     |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Format:**

```json
{
  "title": "The Avengers",
  "description": "Earth's mightiest heroes...",
  "releaseDate": "2024-05-01",
  "genre": ["Action", "Adventure", "Sci-Fi"],
  "director": "Anthony Russo",
  "cast": [
    {
      "_id": "607f1f77bcf86cd799439001",
      "name": "Robert Downey Jr.",
      "character": "Tony Stark"
    }
  ],
  "rating": 8.5,
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://youtube.com/watch?v=...",
  "duration": 150,
  "isKidsMode": false
}
```

**Request Validation:**

- `title`: Bắt buộc, độ dài 1-200 ký tự
- `description`: Bắt buộc, độ dài tối thiểu 10 ký tự
- `releaseDate`: Bắt buộc, định dạng ISO 8601
- `genre`: Bắt buộc, mảng không rỗng
- `duration`: Bắt buộc, số dương > 0

**Response Success (201):**

```json
{
  "success": true,
  "message": "Thêm phim thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "The Avengers",
    "description": "Earth's mightiest heroes...",
    "genre": ["Action", "Adventure", "Sci-Fi"],
    "rating": 8.5,
    "createdAt": "2024-01-25T16:00:00Z"
  }
}
```

---

### 2.5 Cập nhật Phim (Admin)

| Thành phần         | Chi tiết                       |
| ------------------ | ------------------------------ |
| **Endpoint**       | `/api/movies/:movieId`         |
| **Method**         | `PUT`                          |
| **Authentication** | Yêu cầu JWT Token + Role Admin |
| **Description**    | Cập nhật thông tin phim        |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID của phim cần cập nhật

**Request Format:**

```json
{
  "title": "The Avengers: Endgame",
  "rating": 8.7,
  "description": "After the devastating events...",
  "isKidsMode": false
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Cập nhật phim thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "The Avengers: Endgame",
    "rating": 8.7,
    "updatedAt": "2024-01-25T16:15:00Z"
  }
}
```

---

### 2.6 Xóa Phim (Admin)

| Thành phần         | Chi tiết                       |
| ------------------ | ------------------------------ |
| **Endpoint**       | `/api/movies/:movieId`         |
| **Method**         | `DELETE`                       |
| **Authentication** | Yêu cầu JWT Token + Role Admin |
| **Description**    | Xóa phim khỏi hệ thống         |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID của phim cần xóa

**Request Format:**

```json
{}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Xóa phim thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "The Avengers"
  }
}
```

---

## 3. Chế độ Trẻ em

### 3.1 Bật/Tắt Chế độ Trẻ em

| Thành phần         | Chi tiết                                            |
| ------------------ | --------------------------------------------------- |
| **Endpoint**       | `/api/user/kids-mode`                               |
| **Method**         | `PUT`                                               |
| **Authentication** | Yêu cầu JWT Token                                   |
| **Description**    | Bật hoặc tắt chế độ trẻ em cho tài khoản người dùng |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Format:**

```json
{
  "kidsMode": true,
  "password": "securePassword123"
}
```

**Request Validation:**

- `kidsMode`: Bắt buộc, kiểu boolean
- `password`: Bắt buộc khi bật chế độ trẻ em (để xác thực), tối thiểu 8 ký tự

**Response Success (200):**

```json
{
  "success": true,
  "message": "Cập nhật chế độ trẻ em thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "kidsMode": true,
    "updatedAt": "2024-01-25T17:00:00Z"
  }
}
```

**Response Error (401):**

```json
{
  "success": false,
  "message": "Mật khẩu không chính xác",
  "statusCode": 401
}
```

---

### 3.2 Lấy danh sách Phim Chế độ Trẻ em

| Thành phần         | Chi tiết                              |
| ------------------ | ------------------------------------- |
| **Endpoint**       | `/api/movies/kids-mode`               |
| **Method**         | `GET`                                 |
| **Authentication** | Không yêu cầu                         |
| **Description**    | Lấy danh sách phim phù hợp với trẻ em |

**Query Parameters:**

```
?page=1&limit=20&genre=animation&sort=-rating
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Lấy danh sách phim chế độ trẻ em thành công",
  "data": {
    "movies": [
      {
        "_id": "507f1f77bcf86cd799439051",
        "title": "Toy Story",
        "description": "A cowboy doll...",
        "genre": ["Animation", "Adventure"],
        "isKidsMode": true,
        "rating": 8.3,
        "posterUrl": "https://example.com/poster.jpg"
      },
      {
        "_id": "507f1f77bcf86cd799439052",
        "title": "Frozen",
        "description": "Two sisters...",
        "genre": ["Animation", "Musical"],
        "isKidsMode": true,
        "rating": 7.4,
        "posterUrl": "https://example.com/poster.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

## 4. Quản lý Trang Phim Yêu thích

### 4.1 Lấy danh sách Phim Yêu thích

| Thành phần         | Chi tiết                                    |
| ------------------ | ------------------------------------------- |
| **Endpoint**       | `/api/user/favorites`                       |
| **Method**         | `GET`                                       |
| **Authentication** | Yêu cầu JWT Token                           |
| **Description**    | Lấy danh sách phim yêu thích của người dùng |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Query Parameters:**

```
?page=1&limit=12&sort=-createdAt
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Lấy danh sách phim yêu thích thành công",
  "data": {
    "favorites": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "movie": {
          "_id": "507f1f77bcf86cd799439020",
          "title": "The Avengers",
          "posterUrl": "https://example.com/poster1.jpg",
          "rating": 8.5,
          "genre": ["Action", "Adventure", "Sci-Fi"]
        },
        "addedAt": "2024-01-20T10:30:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439031",
        "movie": {
          "_id": "507f1f77bcf86cd799439021",
          "title": "Inception",
          "posterUrl": "https://example.com/poster2.jpg",
          "rating": 8.8,
          "genre": ["Sci-Fi", "Thriller"]
        },
        "addedAt": "2024-01-22T14:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 28,
      "totalPages": 3
    }
  }
}
```

---

### 4.2 Thêm Phim vào Yêu thích

| Thành phần         | Chi tiết                          |
| ------------------ | --------------------------------- |
| **Endpoint**       | `/api/favorites`                  |
| **Method**         | `POST`                            |
| **Authentication** | Yêu cầu JWT Token                 |
| **Description**    | Thêm phim vào danh sách yêu thích |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Format:**

```json
{
  "movieId": "507f1f77bcf86cd799439020"
}
```

**Request Validation:**

- `movieId`: Bắt buộc, phải là ID phim hợp lệ

**Response Success (201):**

```json
{
  "success": true,
  "message": "Thêm vào yêu thích thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439032",
    "userId": "507f1f77bcf86cd799439011",
    "movieId": "507f1f77bcf86cd799439020",
    "addedAt": "2024-01-25T18:00:00Z"
  }
}
```

**Response Error (409):**

```json
{
  "success": false,
  "message": "Phim này đã có trong danh sách yêu thích",
  "statusCode": 409
}
```

---

### 4.3 Xóa Phim khỏi Yêu thích

| Thành phần         | Chi tiết                          |
| ------------------ | --------------------------------- |
| **Endpoint**       | `/api/favorites/:movieId`         |
| **Method**         | `DELETE`                          |
| **Authentication** | Yêu cầu JWT Token                 |
| **Description**    | Xóa phim khỏi danh sách yêu thích |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID của phim cần xóa

**Request Format:**

```json
{}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Xóa khỏi yêu thích thành công",
  "data": {
    "favoriteId": "507f1f77bcf86cd799439032"
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Phim không có trong danh sách yêu thích",
  "statusCode": 404
}
```

---

### 4.4 Kiểm tra Phim có trong Yêu thích không

| Thành phần         | Chi tiết                                                 |
| ------------------ | -------------------------------------------------------- |
| **Endpoint**       | `/api/favorites/:movieId/check`                          |
| **Method**         | `GET`                                                    |
| **Authentication** | Yêu cầu JWT Token                                        |
| **Description**    | Kiểm tra xem phim có trong danh sách yêu thích hay không |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID của phim cần kiểm tra

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "isFavorited": true,
    "movieId": "507f1f77bcf86cd799439020"
  }
}
```

---

## 5. Danh sách Phim của Diễn viên

### 5.1 Lấy thông tin Diễn viên

| Thành phần         | Chi tiết                                 |
| ------------------ | ---------------------------------------- |
| **Endpoint**       | `/api/actors/:actorId`                   |
| **Method**         | `GET`                                    |
| **Authentication** | Không yêu cầu                            |
| **Description**    | Lấy thông tin chi tiết của một diễn viên |

**Path Parameters:**

- `actorId`: ID của diễn viên

**Response Success (200):**

```json
{
  "success": true,
  "message": "Lấy thông tin diễn viên thành công",
  "data": {
    "_id": "607f1f77bcf86cd799439001",
    "name": "Robert Downey Jr.",
    "biography": "Robert John Downey Jr. is an American actor...",
    "birthDate": "1965-04-04",
    "nationality": "American",
    "profileImage": "https://example.com/actor.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 5.2 Lấy danh sách Phim của Diễn viên

| Thành phần         | Chi tiết                                                |
| ------------------ | ------------------------------------------------------- |
| **Endpoint**       | `/api/actors/:actorId/movies`                           |
| **Method**         | `GET`                                                   |
| **Authentication** | Không yêu cầu                                           |
| **Description**    | Lấy danh sách toàn bộ phim có sự tham gia của diễn viên |

**Path Parameters:**

- `actorId`: ID của diễn viên

**Query Parameters:**

```
?page=1&limit=12&sort=-releaseDate&genre=action
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Lấy danh sách phim của diễn viên thành công",
  "data": {
    "actor": {
      "_id": "607f1f77bcf86cd799439001",
      "name": "Robert Downey Jr.",
      "profileImage": "https://example.com/actor.jpg"
    },
    "movies": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "title": "The Avengers",
        "releaseDate": "2024-05-01",
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "rating": 8.5,
        "character": "Tony Stark",
        "posterUrl": "https://example.com/poster1.jpg",
        "duration": 150
      },
      {
        "_id": "507f1f77bcf86cd799439021",
        "title": "Iron Man",
        "releaseDate": "2024-04-15",
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "rating": 7.9,
        "character": "Tony Stark",
        "posterUrl": "https://example.com/poster2.jpg",
        "duration": 126
      },
      {
        "_id": "507f1f77bcf86cd799439022",
        "title": "Avengers: Endgame",
        "releaseDate": "2024-06-02",
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "rating": 8.8,
        "character": "Tony Stark",
        "posterUrl": "https://example.com/poster3.jpg",
        "duration": 181
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 42,
      "totalPages": 4
    }
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Diễn viên không tồn tại",
  "statusCode": 404
}
```

---

### 5.3 Tìm kiếm Diễn viên

| Thành phần         | Chi tiết                    |
| ------------------ | --------------------------- |
| **Endpoint**       | `/api/actors/search`        |
| **Method**         | `GET`                       |
| **Authentication** | Không yêu cầu               |
| **Description**    | Tìm kiếm diễn viên theo tên |

**Query Parameters:**

```
?q=robert&page=1&limit=10
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Tìm kiếm diễn viên thành công",
  "data": {
    "results": [
      {
        "_id": "607f1f77bcf86cd799439001",
        "name": "Robert Downey Jr.",
        "profileImage": "https://example.com/actor1.jpg",
        "nationality": "American",
        "movieCount": 42
      },
      {
        "_id": "607f1f77bcf86cd799439002",
        "name": "Robert De Niro",
        "profileImage": "https://example.com/actor2.jpg",
        "nationality": "American",
        "movieCount": 56
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

---

## 📋 Bảng Tóm tắt API Endpoints

| #      | Chức năng             | Endpoint                        | Method | Auth | Quyền  |
| ------ | --------------------- | ------------------------------- | ------ | ---- | ------ |
| **1**  | Đăng ký               | `/api/auth/register`            | POST   | ❌   | -      |
| **2**  | Đăng nhập             | `/api/auth/login`               | POST   | ❌   | -      |
| **3**  | Đăng xuất             | `/api/auth/logout`              | POST   | ✅   | Tất cả |
| **4**  | Lấy DS người dùng     | `/api/users`                    | GET    | ✅   | Admin  |
| **5**  | Cập nhật quyền        | `/api/users/:userId/role`       | PUT    | ✅   | Admin  |
| **6**  | Xóa người dùng        | `/api/users/:userId`            | DELETE | ✅   | Admin  |
| **7**  | Thêm phim             | `/api/movies`                   | POST   | ✅   | Admin  |
| **8**  | Cập nhật phim         | `/api/movies/:movieId`          | PUT    | ✅   | Admin  |
| **9**  | Xóa phim              | `/api/movies/:movieId`          | DELETE | ✅   | Admin  |
| **10** | Bật/Tắt chế độ trẻ em | `/api/user/kids-mode`           | PUT    | ✅   | Tất cả |
| **11** | DS phim chế độ trẻ em | `/api/movies/kids-mode`         | GET    | ❌   | -      |
| **12** | DS phim yêu thích     | `/api/user/favorites`           | GET    | ✅   | Tất cả |
| **13** | Thêm yêu thích        | `/api/favorites`                | POST   | ✅   | Tất cả |
| **14** | Xóa yêu thích         | `/api/favorites/:movieId`       | DELETE | ✅   | Tất cả |
| **15** | Kiểm tra yêu thích    | `/api/favorites/:movieId/check` | GET    | ✅   | Tất cả |
| **16** | Thông tin diễn viên   | `/api/actors/:actorId`          | GET    | ❌   | -      |
| **17** | DS phim của diễn viên | `/api/actors/:actorId/movies`   | GET    | ❌   | -      |
| **18** | Tìm kiếm diễn viên    | `/api/actors/search`            | GET    | ❌   | -      |

---

## 🔐 Cấp độ Bảo mật

### Authentication

- Sử dụng **JWT (JSON Web Token)** cho xác thực
- Token được gửi qua header: `Authorization: Bearer <token>`
- Token hết hạn sau: **7 ngày**

### Authorization

- **Public Endpoints**: Không yêu cầu xác thực
- **User Endpoints**: Yêu cầu JWT token hợp lệ
- **Admin Endpoints**: Yêu cầu JWT token + role `admin`

### Password Security

- Mật khẩu được mã hóa bằng **bcryptjs** (salt rounds: 10)
- Mật khẩu tối thiểu: **8 ký tự**
- Phải chứa: chữ hoa, chữ thường, số

---

## 📊 HTTP Status Codes

| Mã      | Ý nghĩa      | Ví dụ                        |
| ------- | ------------ | ---------------------------- |
| **200** | OK           | Yêu cầu thành công           |
| **201** | Created      | Tạo resource thành công      |
| **400** | Bad Request  | Dữ liệu request không hợp lệ |
| **401** | Unauthorized | Xác thực thất bại            |
| **403** | Forbidden    | Không có quyền truy cập      |
| **404** | Not Found    | Resource không tồn tại       |
| **409** | Conflict     | Dữ liệu trùng lặp            |
| **500** | Server Error | Lỗi server                   |

---

## 🧪 Ví dụ Requests với cURL

### Đăng ký

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Đăng nhập

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Lấy Danh sách Phim của Diễn viên

```bash
curl -X GET "http://localhost:5000/api/actors/607f1f77bcf86cd799439001/movies?page=1&limit=12" \
  -H "Content-Type: application/json"
```

### Thêm vào Yêu thích

```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "507f1f77bcf86cd799439020"
  }'
```

---

## 📝 Ghi chú

- Tất cả response đều có cấu trúc: `{ success: boolean, message: string, data: object }`
- Timestamps sử dụng định dạng ISO 8601
- Pagination mặc định: page=1, limit=10
- CORS được cấu hình cho frontend URL
- Rate limiting áp dụng cho tất cả endpoints

---

**Document này được tạo cho mục đích báo cáo dự án. Phiên bản 1.0 - Tháng 1/2024**
