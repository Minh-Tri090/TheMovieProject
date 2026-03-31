# Implementation

## 0. Technologies Used

### Frontend Technologies

| Technology       | Version | Purpose                                    |
| ---------------- | ------- | ------------------------------------------ |
| React.js         | 18+     | UI framework & component library           |
| Vite             | 4.0+    | Build tool & dev server                    |
| React Router DOM | 6+      | Client-side routing                        |
| Axios            | 1.4+    | HTTP client for API calls                  |
| TailwindCSS      | 3+      | Utility-first CSS framework (optional)     |
| SweetAlert2      | 11+     | Beautiful modal dialogs & alerts           |
| React Icons      | 4+      | Icon library (Font Awesome, Feather, etc.) |
| ESLint           | 8+      | Code quality & style enforcement           |
| Node.js          | 18+     | Runtime environment                        |

### Backend Technologies

| Technology | Version | Purpose                            |
| ---------- | ------- | ---------------------------------- |
| Express.js | 4.18+   | Web application framework          |
| Node.js    | 18+     | JavaScript runtime                 |
| MongoDB    | 5.0+    | NoSQL database                     |
| Mongoose   | 7+      | MongoDB ODM (Object Data Modeling) |
| bcryptjs   | 2.4+    | Password hashing & encryption      |
| JWT        | -       | JSON Web Token for authentication  |
| CORS       | 2.8+    | Handle cross-origin requests       |
| dotenv     | 16+     | Environment variables management   |
| nodemon    | 2.0+    | Development file watcher           |
| Postman    | -       | API testing tool (optional)        |

### Database Technologies

| Technology      | Version | Purpose                    |
| --------------- | ------- | -------------------------- |
| MongoDB         | 5.0+    | NoSQL database system      |
| Mongoose Schema | 7+      | Data validation & modeling |

### Development & Deployment Tools

| Technology                    | Purpose                              |
| ----------------------------- | ------------------------------------ |
| Git/GitHub                    | Version control & repository hosting |
| npm                           | Package manager                      |
| Visual Studio Code            | Code editor                          |
| Thunder Client / Postman      | API testing                          |
| MongoDB Atlas / Local MongoDB | Database hosting                     |

### Architecture & Design Patterns

| Pattern                     | Application                        |
| --------------------------- | ---------------------------------- |
| Client-Server               | Separation of frontend and backend |
| MVC (Model-View-Controller) | Backend organization               |
| RESTful API                 | API design standard                |
| JWT Authentication          | Stateless authentication           |
| Context API                 | Frontend state management          |
| Context + Hooks             | Global state management pattern    |

---

## 1. System Structure

### 1.1 Overall Architecture

TheMovie project follows a **Client-Server architecture** with clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Frontend)                     │
│                  React.js + Vite                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages: Home, MovieDetail, Search, Login, etc.   │   │
│  │ Components: Navbar, MovieCard, HeroSlider       │   │
│  │ Context: Auth, Favorites, KidsMode              │   │
│  │ Services: API calls, Authentication             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ (HTTP/REST)
┌─────────────────────────────────────────────────────────┐
│                 Server (Backend)                         │
│              Node.js + Express.js                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes: /api/auth, /api/movies, /api/comments   │   │
│  │ Controllers: Handle business logic              │   │
│  │ Middleware: Auth, Error handling                │   │
│  │ Models: User, Movie, Comment, History           │   │
│  │ Utils: Validation, Helper functions             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ (MongoDB Driver)
┌─────────────────────────────────────────────────────────┐
│                   Database (MongoDB)                     │
│  Collections: users, movies, comments, history,         │
│  favorites, actors                                       │
└─────────────────────────────────────────────────────────┘
```

---

### 1.2 Backend Structure

#### Directory Layout

```
BackEnd/
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
├── package.json             # Dependencies
├── config/
│   └── db.js               # MongoDB connection
├── controllers/            # Business logic handlers
│   ├── authController.js   # Auth operations (login/register)
│   ├── movieController.js  # Movie CRUD operations
│   ├── userController.js   # User profile management
│   ├── commentController.js # Comment operations
│   └── historyController.js # Watch history management
├── middleware/            # Custom middleware
│   ├── authMiddleware.js   # JWT verification
│   └── errorMiddleware.js  # Error handling
├── models/               # Database schemas
│   ├── User.js          # User schema & methods
│   ├── Movie.js         # Movie schema
│   ├── Comment.js       # Comment schema
│   └── ViewHistory.js   # History schema
├── routes/              # API endpoints
│   ├── auth.js         # /api/auth routes
│   ├── movie.js        # /api/movies routes
│   ├── user.js         # /api/user routes
│   ├── comments.js     # /api/comments routes
│   └── history.js      # /api/history routes
└── utils/              # Helper functions
    ├── appError.js     # Custom error class
    ├── asyncHandler.js # Async error wrapper
    ├── auth.js        # Token generation/verification
    ├── comment.js     # Comment utilities
    └── movie.js       # Movie utilities
```

#### Key Technologies

- **Framework:** Express.js (web server)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs
- **Server Port:** 5000
- **Environment:** Node.js 18+

---

### 1.3 Frontend Structure

#### Directory Layout

```
FrontEnd/
├── index.html               # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main app component
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── MovieCard.jsx       # Movie card display
│   │   ├── HeroSlider.jsx      # Hero section with slides
│   │   ├── LatestTrailers.jsx  # Trailers section
│   │   └── Top10Section.jsx    # Top 10 movies
│   ├── pages/            # Page components (routes)
│   │   ├── Home.jsx           # Homepage
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── MovieDetail.jsx    # Movie details page
│   │   ├── Search.jsx         # Search results page
│   │   ├── Favorites.jsx      # Favorites page
│   │   ├── History.jsx        # Watch history page
│   │   ├── Profile.jsx        # User profile page
│   │   ├── ActorMovies.jsx    # Actor's movies page
│   │   └── PremiumPage.jsx    # Premium features page
│   ├── context/          # React Context API
│   │   ├── AuthContext.jsx    # Auth state management
│   │   ├── FavoriteContext.jsx # Favorites state
│   │   └── KidsModeContext.jsx # Kids mode state
│   ├── services/         # API communication
│   │   ├── api.js            # Axios instance & HTTP calls
│   │   └── auth.js           # Auth service functions
│   ├── utils/           # Helper functions
│   │   └── toast.js     # Toast notification utility
│   ├── styles/          # Global & component styles
│   │   └── History.css
│   └── assets/          # Static assets (images, etc.)
```

#### Key Technologies

- **Framework:** React.js 18+
- **Build Tool:** Vite (fast bundler)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** CSS3 + TailwindCSS (optional)
- **Notifications:** SweetAlert2
- **Dev Tool:** ESLint

---

### 1.4 Database Schema

#### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (bcryptjs encrypted),
  role: String (enum: ['user', 'admin']),
  kidsMode: Boolean (default: false),
  isPremium: Boolean (default: false),
  premiumExpireDate: Date (optional),
  profileImage: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### Movies Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  genre: [String],
  duration: Number (in minutes),
  rating: Number (1-10),
  releaseDate: Date,
  posterUrl: String (URL),
  bannerUrl: String (URL),
  trailerUrl: String (URL),
  cast: [{
    name: String,
    character: String,
    profileImage: String
  }],
  director: String,
  isKidsMode: Boolean,
  viewCount: Number (default: 0),
  commentsCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

#### Comments Collection

```javascript
{
  _id: ObjectId,
  movieId: ObjectId (ref: Movie),
  userId: ObjectId (ref: User),
  content: String,
  rating: Number (1-10),
  likes: Number (default: 0),
  likedBy: [ObjectId] (user IDs),
  createdAt: Date,
  updatedAt: Date
}
```

#### ViewHistory Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  movieId: ObjectId (ref: Movie),
  watchedAt: Date,
  lastPosition: Number (in seconds),
  duration: Number (total duration),
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Favorites Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  movieId: ObjectId (ref: Movie),
  addedAt: Date,
  createdAt: Date
}
```

---

## 2. Description of Main Functions

### 2.1 Backend Main Functions

#### Authentication Module (`authController.js`)

**`register(req, res, next)`**

- **Purpose:** User account registration
- **Input:** username, email, password, confirmPassword
- **Process:**
  1. Validate input fields
  2. Check if email already exists
  3. Hash password using bcryptjs (10 salt rounds)
  4. Create new user document
  5. Generate JWT token (7-day expiration)
- **Output:** User object with authentication token
- **Error Handling:** Duplicate email, validation errors

**`login(req, res, next)`**

- **Purpose:** User authentication and session creation
- **Input:** email, password
- **Process:**
  1. Validate input
  2. Find user by email
  3. Compare password with hashed version
  4. Generate JWT token
  5. Return user info and token
- **Output:** User object with token
- **Error Handling:** Invalid credentials, user not found

**`logout(req, res, next)`**

- **Purpose:** End user session (client-side token deletion)
- **Input:** JWT token (from Authorization header)
- **Process:**
  1. Verify token validity
  2. Clear client-side storage message
  3. Return success response
- **Output:** Logout confirmation

---

#### Movie Management Module (`movieController.js`)

**`getAllMovies(req, res, next)`**

- **Purpose:** Retrieve all movies with pagination
- **Input:** page, limit, filter (optional)
- **Process:**
  1. Parse pagination parameters
  2. Build query filter
  3. Execute database query
  4. Calculate total count
  5. Return paginated results
- **Output:** Array of movies with pagination info
- **Features:** Search filter, sorting, kids mode filter

**`getMovieById(req, res, next)`**

- **Purpose:** Fetch detailed information about a specific movie
- **Input:** movieId (URL parameter)
- **Process:**
  1. Validate movieId format
  2. Query database for movie
  3. Populate related data (comments count, cast)
  4. Increment view count
  5. Return movie details
- **Output:** Complete movie object with cast, comments count

**`createMovie(req, res, next)` [Admin Only]**

- **Purpose:** Add new movie to database
- **Input:** title, description, genre, duration, rating, posterUrl, cast
- **Process:**
  1. Verify admin authorization
  2. Validate movie data
  3. Check title uniqueness
  4. Create movie document
  5. Return created movie
- **Output:** New movie object
- **Restrictions:** Admin role required

**`updateMovie(req, res, next)` [Admin Only]**

- **Purpose:** Modify existing movie information
- **Input:** movieId, fields to update (title, description, genre, etc.)
- **Process:**
  1. Verify admin authorization
  2. Find movie by ID
  3. Update specified fields
  4. Save changes
  5. Return updated movie
- **Output:** Updated movie object

**`deleteMovie(req, res, next)` [Admin Only]**

- **Purpose:** Remove movie from database
- **Input:** movieId
- **Process:**
  1. Verify admin authorization
  2. Find and delete movie
  3. Remove related comments
  4. Remove from favorites
  5. Return success message
- **Output:** Deletion confirmation
- **Cascading:** Deletes associated comments and favorite records

**`searchMovies(req, res, next)`**

- **Purpose:** Search movies by title, genre, or cast
- **Input:** query string, filters (genre, rating, year)
- **Process:**
  1. Parse search query
  2. Build regex pattern for title search
  3. Apply additional filters
  4. Execute database query
  5. Return matching results
- **Output:** Array of matching movies
- **Features:** Text search, genre filtering, rating filtering

---

#### User Management Module (`userController.js`)

**`getUserProfile(req, res, next)`**

- **Purpose:** Retrieve current user's profile information
- **Input:** JWT token (from middleware)
- **Process:**
  1. Extract userId from token
  2. Query user document
  3. Exclude password from result
  4. Calculate statistics (favorites count, watch history count)
  5. Return profile data
- **Output:** User profile object
- **Restrictions:** Authenticated users only

**`updateUserProfile(req, res, next)`**

- **Purpose:** Update user profile information
- **Input:** username, email, profileImage (optional)
- **Process:**
  1. Validate new data
  2. Check email uniqueness (if changed)
  3. Update user document
  4. Return updated profile
- **Output:** Updated user object
- **Restrictions:** Users can only update their own profile

**`changePassword(req, res, next)`**

- **Purpose:** Update user password
- **Input:** currentPassword, newPassword, confirmPassword
- **Process:**
  1. Verify current password
  2. Validate new password format
  3. Hash new password
  4. Update database
  5. Return success message
- **Output:** Confirmation message
- **Security:** Requires current password verification

**`deleteAccount(req, res, next)`**

- **Purpose:** Permanently delete user account
- **Input:** password (confirmation), userId
- **Process:**
  1. Verify password
  2. Delete user document
  3. Delete related comments
  4. Delete favorite records
  5. Delete watch history
- **Output:** Deletion confirmation
- **Cascading:** Removes all user-related data

**`enableKidsMode(req, res, next)`**

- **Purpose:** Toggle kids mode for parental controls
- **Input:** kidsMode (boolean)
- **Process:**
  1. Update user's kidsMode flag
  2. Filter movie recommendations accordingly
  3. Save changes
  4. Return updated status
- **Output:** Updated kids mode status

---

#### Comments Module (`commentController.js`)

**`getMovieComments(req, res, next)`**

- **Purpose:** Retrieve all comments for a specific movie
- **Input:** movieId, page, limit
- **Process:**
  1. Validate movieId
  2. Query comments by movieId
  3. Sort by creation date (newest first)
  4. Apply pagination
  5. Populate user details for each comment
- **Output:** Paginated array of comments with author info

**`createComment(req, res, next)`**

- **Purpose:** Add new comment to a movie
- **Input:** movieId, content, rating
- **Process:**
  1. Validate input fields
  2. Check content length (max 500 chars)
  3. Validate rating (1-10)
  4. Create comment document
  5. Increment movie's comment count
  6. Return created comment
- **Output:** New comment object

**`deleteComment(req, res, next)`**

- **Purpose:** Remove a comment
- **Input:** commentId
- **Process:**
  1. Verify comment ownership or admin status
  2. Find comment
  3. Delete comment document
  4. Decrement movie's comment count
  5. Return success message
- **Output:** Deletion confirmation
- **Restrictions:** Comment owner or admin only

**`likeComment(req, res, next)`**

- **Purpose:** Add like to a comment
- **Input:** commentId
- **Process:**
  1. Prevent duplicate likes from same user
  2. Add userId to likedBy array
  3. Increment likes count
  4. Return updated comment
- **Output:** Updated comment with new like count

---

#### Watch History Module (`historyController.js`)

**`getUserHistory(req, res, next)`**

- **Purpose:** Get user's watch history
- **Input:** Authenticated userId, page, limit
- **Process:**
  1. Query history records for user
  2. Populate movie details for each entry
  3. Sort by watch date (newest first)
  4. Apply pagination
  5. Calculate total watch time
- **Output:** Paginated watch history with movie details

**`addToHistory(req, res, next)`**

- **Purpose:** Log movie watching activity
- **Input:** movieId, lastPosition (timestamp), duration
- **Process:**
  1. Check if record already exists
  2. If exists: update lastPosition and timestamp
  3. If new: create history document
  4. Update movie's view count
  5. Return history entry
- **Output:** History entry record

**`clearHistory(req, res, next)`**

- **Purpose:** Delete all watch history records for user
- **Input:** Authenticated userId
- **Process:**
  1. Delete all history documents for user
  2. Return count of deleted records
- **Output:** Deletion count confirmation

**`deleteHistoryEntry(req, res, next)`**

- **Purpose:** Remove specific history entry
- **Input:** historyId
- **Process:**
  1. Verify ownership
  2. Delete history document
  3. Return success message
- **Output:** Deletion confirmation

---

### 2.2 Frontend Main Functions

#### Authentication Service (`services/auth.js`)

**`register(username, email, password)`**

- **Purpose:** Handle user registration flow
- **Process:**
  1. Validate input format
  2. Call backend `/auth/register` endpoint
  3. Store token in localStorage
  4. Update AuthContext
  5. Redirect to home page
- **Return:** User object and token
- **Error Handling:** Display error toast

**`login(email, password)`**

- **Purpose:** Authenticate user and create session
- **Process:**
  1. Send credentials to backend
  2. Receive and store token
  3. Update auth context
  4. Redirect to home or previous page
- **Return:** User object and token
- **Error Handling:** Show login error message

**`logout()`**

- **Purpose:** End user session
- **Process:**
  1. Remove token from localStorage
  2. Clear AuthContext
  3. Call backend logout endpoint
  4. Redirect to login page
- **Return:** Confirmation

---

#### API Service (`services/api.js`)

**`fetchMovies(page, limit, filter)`**

- **Purpose:** Get paginated movies from backend
- **Process:**
  1. Build query parameters
  2. Send GET request to `/api/movies`
  3. Handle response/errors
- **Return:** Array of movies with pagination info
- **Error Handling:** Network error, server error

**`getMovieDetails(movieId)`**

- **Purpose:** Fetch complete movie information
- **Process:**
  1. Send GET `/api/movies/:movieId`
  2. Cache result (optional)
  3. Return movie data
- **Return:** Movie object with all details

**`searchMovies(query, filters)`**

- **Purpose:** Search movies by keywords
- **Process:**
  1. Send GET `/api/movies/search?q=query`
  2. Apply filters (genre, rating)
  3. Return results
- **Return:** Search results array

**`addToFavorites(movieId)`**

- **Purpose:** Save movie to user's favorites
- **Process:**
  1. Send POST `/api/favorites`
  2. Update FavoriteContext
  3. Show success toast
  4. Re-render UI
- **Return:** Confirmation
- **Error Handling:** Already favorited, error message

**`removeFromFavorites(movieId)`**

- **Purpose:** Remove movie from favorites
- **Process:**
  1. Send DELETE `/api/favorites/:movieId`
  2. Update context
  3. Remove from favorites list
- **Return:** Confirmation

**`addComment(movieId, content, rating)`**

- **Purpose:** Post comment on movie
- **Process:**
  1. Validate comment content
  2. Send POST `/api/comments`
  3. Add to comments list
  4. Reset form
- **Return:** New comment object
- **Validation:** Content length, rating range

**`addToHistory(movieId, currentTime, duration)`**

- **Purpose:** Log watched movie and resume position
- **Process:**
  1. Send POST `/api/history`
  2. Store last watched position
  3. Enable resume functionality
- **Return:** History entry
- **Debouncing:** Prevent excessive API calls

---

#### Context Management (`context/`)

**`AuthContext.jsx`**

- **State:** `{ user, token, isAuthenticated, role }`
- **Functions:**
  - `login(userData, token)`: Set user in context
  - `logout()`: Clear auth data
  - `updateProfile(userData)`: Update user info
  - `setRole(role)`: Update user role
- **Purpose:** Global authentication state management

**`FavoriteContext.jsx`**

- **State:** `{ favorites: [movieId] }`
- **Functions:**
  - `addFavorite(movieId)`: Add to favorites
  - `removeFavorite(movieId)`: Remove from favorites
  - `isFavorite(movieId)`: Check if movie is favorited
- **Purpose:** Manage user's favorite movies list

**`KidsModeContext.jsx`**

- **State:** `{ kidsMode: boolean, restrictions: [...] }`
- **Functions:**
  - `toggleKidsMode()`: Enable/disable kids mode
  - `isContentAllowed(rating)`: Check if content is appropriate
- **Purpose:** Parental control management

---

#### Component Functions

**`MovieCard.jsx`**

- **Purpose:** Display individual movie in grid/list
- **Props:** `{ movie, onFavoriteClick, onCardClick }`
- **Features:**
  - Show poster, title, rating
  - Add to favorites button
  - Navigate to detail page on click
  - Lazy load images

**`Navbar.jsx`**

- **Purpose:** Navigation and user menu
- **Features:**
  - Logo and search bar
  - User dropdown menu
  - Authentication state display
  - Navigation links

**`HeroSlider.jsx`**

- **Purpose:** Carousel of featured movies
- **Features:**
  - Auto-rotation every 5 seconds
  - Manual navigation buttons
  - Smooth transitions
  - Click to navigate to movie

**`LatestTrailers.jsx`**

- **Purpose:** Display recent movie trailers
- **Features:**
  - Video thumbnail with play button
  - Trailer preview modal
  - Embedded video player

---

#### Page Components

**`Home.jsx`**

- **Purpose:** Landing page
- **Features:**
  - Hero slider with featured movies
  - Latest trailers section
  - Top 10 movies list
  - Genre carousel
  - Recommendations

**`MovieDetail.jsx`**

- **Purpose:** Detailed movie information page
- **Features:**
  - Full movie information (cast, duration, rating)
  - Comments section
  - Add to favorites button
  - Add to watch history
  - Recommendation carousel
  - Video player (stub)

**`Search.jsx`**

- **Purpose:** Search results page
- **Features:**
  - Display search results
  - Filter by genre, rating, year
  - Pagination
  - "No results" message

**`Favorites.jsx`**

- **Purpose:** User's favorite movies
- **Features:**
  - Grid of favorited movies
  - Remove from favorites option
  - Sort by date added
  - Empty state message

**`History.jsx`**

- **Purpose:** Watch history with resume feature
- **Features:**
  - List of watched movies
  - Last watched position indicator
  - Clear history button
  - Delete individual entry
  - Sort by date (newest first)

**`Profile.jsx`**

- **Purpose:** User account management
- **Features:**
  - Display user information (username, email, profile picture)
  - Edit profile button
  - Change password form
  - Delete account button
  - Subscription status

---

## 3. Data Flow

### 3.1 Authentication Flow

```
User Input (Login Form)
    ↓
validateInput()
    ↓
api.login(email, password)
    ↓
Backend: compare password with bcryptjs
    ↓
Generate JWT token
    ↓
Return token + user object
    ↓
Store token in localStorage
    ↓
Update AuthContext
    ↓
Redirect to Home
```

### 3.2 Movie Interaction Flow

```
User Views Movie
    ↓
getMovieDetails(movieId)
    ↓
Database query with populate comments
    ↓
Increment viewCount
    ↓
Display movie details page
    ↓
User adds to favorites OR comments
    ↓
API call to backend
    ↓
Update database
    ↓
Update context state
    ↓
Re-render affected components
```

### 3.3 Watch History Flow

```
User watches movie
    ↓
setInterval() tracks current playback time
    ↓
API call: addToHistory(movieId, currentTime)
    ↓
Backend checks if history exists for this user+movie
    ↓
Update lastPosition and watchedAt timestamp
    ↓
Return updated history entry
    ↓
User can resume from lastPosition next time
```

---

## 4. Key Technologies & Libraries

| Layer        | Technology       | Purpose                 |
| ------------ | ---------------- | ----------------------- |
| **Frontend** | React 18+        | UI framework            |
|              | Vite             | Build tool & dev server |
|              | Axios            | HTTP client             |
|              | React Router DOM | Client-side routing     |
|              | TailwindCSS      | Styling (optional)      |
|              | SweetAlert2      | Beautiful alerts        |
|              | React Icons      | Icon library            |
| **Backend**  | Express.js       | Web framework           |
|              | Node.js          | Runtime                 |
|              | Mongoose         | ODM                     |
|              | bcryptjs         | Password hashing        |
|              | JWT              | Authentication          |
|              | CORS             | Cross-origin requests   |
|              | dotenv           | Environment variables   |
| **Database** | MongoDB          | NoSQL database          |

---

## 5. Error Handling Strategy

### Backend Error Handling

**Custom Error Class (`utils/appError.js`)**

```javascript
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
```

**Error Middleware (`middleware/errorMiddleware.js`)**

- Catches all errors from routes/controllers
- Formats error responses
- Logs errors for debugging
- Returns appropriate HTTP status codes

**Async Handler (`utils/asyncHandler.js`)**

- Wraps async functions
- Catches Promise rejections
- Passes errors to middleware

### Frontend Error Handling

**Toast Notifications (`utils/toast.js`)**

- Success: Green toast
- Error: Red toast with message
- Warning: Yellow toast

**Try-Catch Blocks**

- API calls wrapped in try-catch
- Display error to user
- Log to console (development)

---

## 6. Performance Optimizations

### Backend

- Database indexing on frequently searched fields (email, username, title)
- Pagination to limit data transfer
- Query optimization with `populate()` and `select()`
- Caching for static data (movies, actors)

### Frontend

- Component code splitting with React.lazy()
- Image lazy loading
- Memoization with React.memo()
- Context optimization to prevent unnecessary re-renders
- Debouncing on search input
- Request throttling for API calls

---

_Implementation Documentation - TheMovie Project | Version 1.0_
