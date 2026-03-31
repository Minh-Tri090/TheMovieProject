# 🔌 API Design Documentation

## Table of Contents

1. [1. Authentication Features (Login/Register)](#1-authentication-features-loginregister)
2. [2. Admin/User Role Management](#2-adminuser-role-management)
3. [3. Kids Mode](#3-kids-mode)
4. [4. Favorite Movies Management](#4-favorite-movies-management)
5. [5. Actor's Movies List](#5-actors-movies-list)

---

## 1. Authentication Features (Login/Register)

### 1.1 Register Account

| Component          | Details                     |
| ------------------ | --------------------------- |
| **Endpoint**       | `/api/auth/register`        |
| **Method**         | `POST`                      |
| **Authentication** | Not required                |
| **Description**    | Register a new user account |

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

- `username`: Required, length 3-20 characters, no special characters
- `email`: Required, valid email format, unique in the system
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, numbers
- `confirmPassword`: Required, must match password

**Response Success (201):**

```json
{
  "success": true,
  "message": "Registration successful",
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
  "message": "Email already exists in the system",
  "statusCode": 409
}
```

---

### 1.2 Login

| Component          | Details                     |
| ------------------ | --------------------------- |
| **Endpoint**       | `/api/auth/login`           |
| **Method**         | `POST`                      |
| **Authentication** | Not required                |
| **Description**    | Authenticate and login user |

**Request Format:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Request Validation:**

- `email`: Required, valid email format
- `password`: Required, minimum 8 characters

**Response Success (200):**

```json
{
  "success": true,
  "message": "Login successful",
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
  "message": "Email or password is incorrect",
  "statusCode": 401
}
```

---

### 1.3 Logout

| Component          | Details             |
| ------------------ | ------------------- |
| **Endpoint**       | `/api/auth/logout`  |
| **Method**         | `POST`              |
| **Authentication** | Requires JWT Token  |
| **Description**    | Logout user account |

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
  "message": "Logout successful"
}
```

---

## 2. Admin/User Role Management

### 2.1 Get Users List

| Component          | Details                            |
| ------------------ | ---------------------------------- |
| **Endpoint**       | `/api/users`                       |
| **Method**         | `GET`                              |
| **Authentication** | Requires JWT Token + Admin Role    |
| **Description**    | Get list of all users (Admin only) |

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
  "message": "Get users list successfully",
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
  "message": "You do not have permission to access this resource",
  "statusCode": 403
}
```

---

### 2.2 Update User Role

| Component          | Details                         |
| ------------------ | ------------------------------- |
| **Endpoint**       | `/api/users/:userId/role`       |
| **Method**         | `PUT`                           |
| **Authentication** | Requires JWT Token + Admin Role |
| **Description**    | Change user role (role)         |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `userId`: ID of the user to update

**Request Format:**

```json
{
  "role": "admin"
}
```

**Request Validation:**

- `role`: Required, valid values: `"user"` or `"admin"`

**Response Success (200):**

```json
{
  "success": true,
  "message": "Update role successfully",
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
  "message": "User does not exist",
  "statusCode": 404
}
```

---

### 2.3 Delete User

| Component          | Details                             |
| ------------------ | ----------------------------------- |
| **Endpoint**       | `/api/users/:userId`                |
| **Method**         | `DELETE`                            |
| **Authentication** | Requires JWT Token + Admin Role     |
| **Description**    | Delete user account from the system |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `userId`: ID of the user to delete

**Request Format:**

```json
{}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Delete user successfully",
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
  "message": "You cannot delete an admin account",
  "statusCode": 403
}
```

---

### 2.4 Add Movie (Admin)

| Component          | Details                         |
| ------------------ | ------------------------------- |
| **Endpoint**       | `/api/movies`                   |
| **Method**         | `POST`                          |
| **Authentication** | Requires JWT Token + Admin Role |
| **Description**    | Add new movie to the system     |

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

- `title`: Required, length 1-200 characters
- `description`: Required, minimum 10 characters
- `releaseDate`: Required, ISO 8601 format
- `genre`: Required, non-empty array
- `duration`: Required, positive number > 0

**Response Success (201):**

```json
{
  "success": true,
  "message": "Add movie successfully",
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

### 2.5 Update Movie (Admin)

| Component          | Details                         |
| ------------------ | ------------------------------- |
| **Endpoint**       | `/api/movies/:movieId`          |
| **Method**         | `PUT`                           |
| **Authentication** | Requires JWT Token + Admin Role |
| **Description**    | Update movie information        |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID of the movie to update

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
  "message": "Update movie successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "The Avengers: Endgame",
    "rating": 8.7,
    "updatedAt": "2024-01-25T16:15:00Z"
  }
}
```

---

### 2.6 Delete Movie (Admin)

| Component          | Details                         |
| ------------------ | ------------------------------- |
| **Endpoint**       | `/api/movies/:movieId`          |
| **Method**         | `DELETE`                        |
| **Authentication** | Requires JWT Token + Admin Role |
| **Description**    | Delete movie from the system    |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID of the movie to delete

**Request Format:**

```json
{}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Delete movie successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "The Avengers"
  }
}
```

---

## 3. Kids Mode

### 3.1 Enable/Disable Kids Mode

| Component          | Details                                      |
| ------------------ | -------------------------------------------- |
| **Endpoint**       | `/api/user/kids-mode`                        |
| **Method**         | `PUT`                                        |
| **Authentication** | Requires JWT Token                           |
| **Description**    | Enable or disable kids mode for user account |

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

- `kidsMode`: Required, boolean type
- `password`: Required when enabling kids mode (for authentication), minimum 8 characters

**Response Success (200):**

```json
{
  "success": true,
  "message": "Update kids mode successfully",
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
  "message": "Password is incorrect",
  "statusCode": 401
}
```

---

### 3.2 Get Kids Mode Movies List

| Component          | Details                              |
| ------------------ | ------------------------------------ |
| **Endpoint**       | `/api/movies/kids-mode`              |
| **Method**         | `GET`                                |
| **Authentication** | Not required                         |
| **Description**    | Get list of movies suitable for kids |

**Query Parameters:**

```
?page=1&limit=20&genre=animation&sort=-rating
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Get kids mode movies list successfully",
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

## 4. Favorite Movies Management

### 4.1 Get Favorite Movies List

| Component          | Details                            |
| ------------------ | ---------------------------------- |
| **Endpoint**       | `/api/user/favorites`              |
| **Method**         | `GET`                              |
| **Authentication** | Requires JWT Token                 |
| **Description**    | Get list of user's favorite movies |

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
  "message": "Get favorite movies list successfully",
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

### 4.2 Add Movie to Favorites

| Component          | Details                     |
| ------------------ | --------------------------- |
| **Endpoint**       | `/api/favorites`            |
| **Method**         | `POST`                      |
| **Authentication** | Requires JWT Token          |
| **Description**    | Add movie to favorites list |

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

- `movieId`: Required, must be a valid movie ID

**Response Success (201):**

```json
{
  "success": true,
  "message": "Add to favorites successfully",
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
  "message": "This movie is already in the favorites list",
  "statusCode": 409
}
```

---

### 4.3 Remove Movie from Favorites

| Component          | Details                          |
| ------------------ | -------------------------------- |
| **Endpoint**       | `/api/favorites/:movieId`        |
| **Method**         | `DELETE`                         |
| **Authentication** | Requires JWT Token               |
| **Description**    | Remove movie from favorites list |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID of the movie to remove

**Request Format:**

```json
{}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Remove from favorites successfully",
  "data": {
    "favoriteId": "507f1f77bcf86cd799439032"
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Movie is not in the favorites list",
  "statusCode": 404
}
```

---

### 4.4 Check if Movie is in Favorites

| Component          | Details                                 |
| ------------------ | --------------------------------------- |
| **Endpoint**       | `/api/favorites/:movieId/check`         |
| **Method**         | `GET`                                   |
| **Authentication** | Requires JWT Token                      |
| **Description**    | Check if movie is in the favorites list |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

- `movieId`: ID of the movie to check

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

## 5. Actor's Movies List

### 5.1 Get Actor Information

| Component          | Details                              |
| ------------------ | ------------------------------------ |
| **Endpoint**       | `/api/actors/:actorId`               |
| **Method**         | `GET`                                |
| **Authentication** | Not required                         |
| **Description**    | Get detailed information of an actor |

**Path Parameters:**

- `actorId`: Actor ID

**Response Success (200):**

```json
{
  "success": true,
  "message": "Get actor information successfully",
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

### 5.2 Get Actor's Movies List

| Component          | Details                                           |
| ------------------ | ------------------------------------------------- |
| **Endpoint**       | `/api/actors/:actorId/movies`                     |
| **Method**         | `GET`                                             |
| **Authentication** | Not required                                      |
| **Description**    | Get list of all movies with actor's participation |

**Path Parameters:**

- `actorId`: Actor ID

**Query Parameters:**

```
?page=1&limit=12&sort=-releaseDate&genre=action
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Get actor's movies list successfully",
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
  "message": "Actor does not exist",
  "statusCode": 404
}
```

---

### 5.3 Search Actors

| Component          | Details               |
| ------------------ | --------------------- |
| **Endpoint**       | `/api/actors/search`  |
| **Method**         | `GET`                 |
| **Authentication** | Not required          |
| **Description**    | Search actors by name |

**Query Parameters:**

```
?q=robert&page=1&limit=10
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Search actors successfully",
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

## 📋 API Endpoints Summary Table

| #      | Feature                  | Endpoint                        | Method | Auth | Permission |
| ------ | ------------------------ | ------------------------------- | ------ | ---- | ---------- |
| **1**  | Register                 | `/api/auth/register`            | POST   | ❌   | -          |
| **2**  | Login                    | `/api/auth/login`               | POST   | ❌   | -          |
| **3**  | Logout                   | `/api/auth/logout`              | POST   | ✅   | All        |
| **4**  | Get Users List           | `/api/users`                    | GET    | ✅   | Admin      |
| **5**  | Update Role              | `/api/users/:userId/role`       | PUT    | ✅   | Admin      |
| **6**  | Delete User              | `/api/users/:userId`            | DELETE | ✅   | Admin      |
| **7**  | Add Movie                | `/api/movies`                   | POST   | ✅   | Admin      |
| **8**  | Update Movie             | `/api/movies/:movieId`          | PUT    | ✅   | Admin      |
| **9**  | Delete Movie             | `/api/movies/:movieId`          | DELETE | ✅   | Admin      |
| **10** | Enable/Disable Kids Mode | `/api/user/kids-mode`           | PUT    | ✅   | All        |
| **11** | Kids Mode Movies         | `/api/movies/kids-mode`         | GET    | ❌   | -          |
| **12** | Get Favorites            | `/api/user/favorites`           | GET    | ✅   | All        |
| **13** | Add Favorite             | `/api/favorites`                | POST   | ✅   | All        |
| **14** | Remove Favorite          | `/api/favorites/:movieId`       | DELETE | ✅   | All        |
| **15** | Check Favorite           | `/api/favorites/:movieId/check` | GET    | ✅   | All        |
| **16** | Actor Info               | `/api/actors/:actorId`          | GET    | ❌   | -          |
| **17** | Actor Movies             | `/api/actors/:actorId/movies`   | GET    | ❌   | -          |
| **18** | Search Actors            | `/api/actors/search`            | GET    | ❌   | -          |

---

## 🔐 Security Levels

### Authentication

- Uses **JWT (JSON Web Token)** for authentication
- Token sent via header: `Authorization: Bearer <token>`
- Token expires after: **7 days**

### Authorization

- **Public Endpoints**: No authentication required
- **User Endpoints**: Requires valid JWT token
- **Admin Endpoints**: Requires JWT token + `admin` role

### Password Security

- Passwords encrypted with **bcryptjs** (salt rounds: 10)
- Minimum password length: **8 characters**
- Must contain: uppercase, lowercase, numbers

---

## 📊 HTTP Status Codes

| Code    | Meaning      | Example                       |
| ------- | ------------ | ----------------------------- |
| **200** | OK           | Request successful            |
| **201** | Created      | Resource created successfully |
| **400** | Bad Request  | Invalid request data          |
| **401** | Unauthorized | Authentication failed         |
| **403** | Forbidden    | No access permission          |
| **404** | Not Found    | Resource does not exist       |
| **409** | Conflict     | Data duplicate                |
| **500** | Server Error | Server error                  |

---

## 🧪 cURL Request Examples

### Register

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

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Actor's Movies List

```bash
curl -X GET "http://localhost:5000/api/actors/607f1f77bcf86cd799439001/movies?page=1&limit=12" \
  -H "Content-Type: application/json"
```

### Add to Favorites

```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "507f1f77bcf86cd799439020"
  }'
```

---

## 📝 Notes

- All responses have structure: `{ success: boolean, message: string, data: object }`
- Timestamps use ISO 8601 format
- Default pagination: page=1, limit=10
- CORS configured for frontend URL
- Rate limiting applied to all endpoints

---

**Document created for project reporting purposes. Version 1.0 - January 2024**
