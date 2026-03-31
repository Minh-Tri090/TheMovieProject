# API Design Summary

## 1. Overview

TheMovie application uses a RESTful API architecture built with Express.js and MongoDB. The API provides 41 endpoints covering authentication, content management, user interactions, and premium features.

**Base URL:** `http://localhost:5000/api`

**Authentication:** JWT (JSON Web Token) with 7-day expiration

---

## 2. API Endpoints Summary

### Complete Endpoint Table (41 Total)

| #                        | Feature Category         | Endpoint                    | Method | Auth | Permission |
| ------------------------ | ------------------------ | --------------------------- | ------ | ---- | ---------- |
| **Authentication (3)**   |
| 1                        | Register                 | `/auth/register`            | POST   | ❌   | -          |
| 2                        | Login                    | `/auth/login`               | POST   | ❌   | -          |
| 3                        | Logout                   | `/auth/logout`              | POST   | ✅   | All        |
| **User Management (4)**  |
| 4                        | Get Users List           | `/users`                    | GET    | ✅   | Admin      |
| 5                        | Update Role              | `/users/:userId/role`       | PUT    | ✅   | Admin      |
| 6                        | Delete User              | `/users/:userId`            | DELETE | ✅   | Admin      |
| 7                        | Get Profile              | `/user/profile`             | GET    | ✅   | All        |
| **Movie Management (9)** |
| 8                        | Add Movie                | `/movies`                   | POST   | ✅   | Admin      |
| 9                        | Update Movie             | `/movies/:movieId`          | PUT    | ✅   | Admin      |
| 10                       | Delete Movie             | `/movies/:movieId`          | DELETE | ✅   | Admin      |
| 11                       | Get Movie Details        | `/movies/:movieId`          | GET    | ❌   | -          |
| 12                       | Get All Movies           | `/movies`                   | GET    | ❌   | -          |
| 13                       | Search Movies            | `/movies/search`            | GET    | ❌   | -          |
| 14                       | Kids Mode Movies         | `/movies/kids-mode`         | GET    | ❌   | -          |
| 15                       | Update Profile           | `/user/profile`             | PUT    | ✅   | All        |
| 16                       | Change Password          | `/user/change-password`     | PUT    | ✅   | All        |
| **Favorites (4)**        |
| 17                       | Get Favorites            | `/user/favorites`           | GET    | ✅   | All        |
| 18                       | Add Favorite             | `/favorites`                | POST   | ✅   | All        |
| 19                       | Remove Favorite          | `/favorites/:movieId`       | DELETE | ✅   | All        |
| 20                       | Check Favorite           | `/favorites/:movieId/check` | GET    | ✅   | All        |
| **Comments (5)**         |
| 21                       | Get Comments             | `/comments/:movieId`        | GET    | ❌   | -          |
| 22                       | Create Comment           | `/comments`                 | POST   | ✅   | All        |
| 23                       | Update Comment           | `/comments/:commentId`      | PUT    | ✅   | Owner      |
| 24                       | Delete Comment           | `/comments/:commentId`      | DELETE | ✅   | Owner      |
| 25                       | Like Comment             | `/comments/:commentId/like` | POST   | ✅   | All        |
| **Watch History (5)**    |
| 26                       | Get History              | `/history`                  | GET    | ✅   | All        |
| 27                       | Add History              | `/history`                  | POST   | ✅   | All        |
| 28                       | Update History           | `/history/:historyId`       | PUT    | ✅   | Owner      |
| 29                       | Delete History           | `/history/:historyId`       | DELETE | ✅   | Owner      |
| 30                       | Clear History            | `/history/clear/all`        | DELETE | ✅   | All        |
| **Actors (3)**           |
| 31                       | Actor Info               | `/actors/:actorId`          | GET    | ❌   | -          |
| 32                       | Actor Movies             | `/actors/:actorId/movies`   | GET    | ❌   | -          |
| 33                       | Search Actors            | `/actors/search`            | GET    | ❌   | -          |
| **Kids Mode (1)**        |
| 34                       | Enable/Disable Kids Mode | `/user/kids-mode`           | PUT    | ✅   | All        |
| **Premium (3)**          |
| 35                       | Premium Status           | `/premium/status`           | GET    | ✅   | All        |
| 36                       | Upgrade Premium          | `/premium/upgrade`          | POST   | ✅   | All        |
| 37                       | Cancel Premium           | `/premium/cancel`           | POST   | ✅   | Premium    |
| **Statistics (2)**       |
| 38                       | User Statistics          | `/user/statistics`          | GET    | ✅   | All        |
| 39                       | Genre Statistics         | `/user/statistics/genres`   | GET    | ✅   | All        |
| **Recommendations (1)**  |
| 40                       | Get Recommendations      | `/recommendations`          | GET    | ❌   | -          |
| 41                       | Delete Account           | `/user/delete-account`      | DELETE | ✅   | All        |

---

## 3. Key Endpoint Examples

### 3.1 Authentication

**Register Account**

```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "507f...",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

**Login**

```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f...",
      "username": "john_doe",
      "role": "user",
      "kidsMode": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

---

### 3.2 Movie Management

**Get Movie Details**

```
GET /api/movies/:movieId

Response (200):
{
  "success": true,
  "data": {
    "_id": "507f...",
    "title": "The Avengers",
    "description": "Earth's mightiest heroes...",
    "genre": ["Action", "Adventure", "Sci-Fi"],
    "rating": 8.5,
    "duration": 150,
    "posterUrl": "https://example.com/poster.jpg",
    "cast": [
      {
        "name": "Robert Downey Jr.",
        "character": "Tony Stark"
      }
    ],
    "commentsCount": 542,
    "viewCount": 125000
  }
}
```

**Add Movie (Admin)**

```
POST /api/movies
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "title": "The Avengers",
  "description": "Earth's mightiest heroes...",
  "genre": ["Action", "Adventure", "Sci-Fi"],
  "duration": 150,
  "rating": 8.5,
  "releaseDate": "2024-05-01",
  "posterUrl": "https://example.com/poster.jpg"
}

Response (201):
{
  "success": true,
  "message": "Add movie successfully",
  "data": { ... }
}
```

**Search Movies**

```
GET /api/movies/search?q=avengers&page=1&limit=10

Response (200):
{
  "success": true,
  "data": {
    "results": [
      {
        "_id": "507f...",
        "title": "The Avengers",
        "rating": 8.5,
        "posterUrl": "https://..."
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 10
    }
  }
}
```

---

### 3.3 User Interactions

**Add to Favorites**

```
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "movieId": "507f1f77bcf86cd799439020"
}

Response (201):
{
  "success": true,
  "message": "Add to favorites successfully",
  "data": {
    "_id": "607f...",
    "movieId": "507f...",
    "addedAt": "2024-01-25T18:00:00Z"
  }
}
```

**Create Comment**

```
POST /api/comments
Authorization: Bearer <token>

Request:
{
  "movieId": "507f...",
  "content": "Amazing movie! Highly recommended.",
  "rating": 9
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "607f...",
    "movieId": "507f...",
    "content": "Amazing movie!",
    "rating": 9,
    "likes": 0,
    "createdAt": "2024-01-26T10:00:00Z"
  }
}
```

**Add to Watch History**

```
POST /api/history
Authorization: Bearer <token>

Request:
{
  "movieId": "507f...",
  "lastPosition": 45,
  "duration": 150
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "607f...",
    "movieId": "507f...",
    "lastPosition": 45,
    "watchedAt": "2024-01-26T21:00:00Z"
  }
}
```

---

### 3.4 Browse & Discovery

**Get Actor's Movies**

```
GET /api/actors/:actorId/movies?page=1&limit=12

Response (200):
{
  "success": true,
  "data": {
    "actor": {
      "_id": "607f...",
      "name": "Robert Downey Jr.",
      "profileImage": "https://..."
    },
    "movies": [
      {
        "title": "The Avengers",
        "character": "Tony Stark",
        "rating": 8.5
      }
    ],
    "pagination": { ... }
  }
}
```

**Get Recommendations**

```
GET /api/recommendations?limit=10&basedOn=history

Response (200):
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "title": "Captain America",
        "rating": 8.2,
        "reason": "Based on your interest in Action movies",
        "matchScore": 0.92
      }
    ]
  }
}
```

---

## 4. Security & Error Handling

### Authentication & Authorization

| Level             | Description                       | Example                                          |
| ----------------- | --------------------------------- | ------------------------------------------------ |
| **Public**        | No auth required                  | GET /api/movies, GET /api/comments/:movieId      |
| **Authenticated** | JWT token required                | GET /api/user/profile, POST /api/favorites       |
| **Admin**         | JWT + Admin role required         | POST /api/movies, DELETE /api/users/:userId      |
| **Owner**         | JWT + Resource owner verification | PUT /api/comments/:commentId (only own comments) |

### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### HTTP Status Codes

| Code    | Meaning      | Example                                  |
| ------- | ------------ | ---------------------------------------- |
| **200** | OK           | Request successful                       |
| **201** | Created      | Resource created                         |
| **400** | Bad Request  | Invalid data format                      |
| **401** | Unauthorized | Missing/invalid token                    |
| **403** | Forbidden    | Insufficient permissions                 |
| **404** | Not Found    | Resource doesn't exist                   |
| **409** | Conflict     | Duplicate email, movie already favorited |
| **500** | Server Error | Internal server error                    |

### Error Response Format

```json
{
  "success": false,
  "message": "Email already exists in the system",
  "statusCode": 409,
  "errors": [
    {
      "field": "email",
      "message": "This email is already registered"
    }
  ]
}
```

---

## 5. Rate Limiting

- **Public endpoints:** 100 requests/minute per IP
- **Authenticated endpoints:** 300 requests/minute per user
- **Premium endpoints:** 1000 requests/minute per user

Response header: `X-RateLimit-Remaining`

---

## 6. Data Validation Rules

### Authentication

- Username: 3-20 characters, no special characters
- Email: Valid format, unique in system
- Password: Minimum 8 characters, must contain uppercase, lowercase, numbers

### Content

- Movie title: 1-200 characters
- Comment content: 1-500 characters
- Rating scale: 1-10 (integer)

### Pagination

- Default: page=1, limit=10
- Maximum limit: 100 per page

---

## 7. Response Format

All API responses follow a consistent structure:

```json
{
  "success": true/false,
  "message": "Descriptive message",
  "statusCode": 200,
  "data": {
    "...": "response data"
  }
}
```

---

**Notes:**

- All timestamps use ISO 8601 format (e.g., 2024-01-26T10:00:00Z)
- CORS enabled for frontend origin
- JWT tokens expire after 7 days
- Password encryption uses bcryptjs (10 salt rounds)
- See `API_DESIGN.md` in appendix for complete endpoint documentation

---

_API Design Summary - TheMovie Project | Version 1.0_
