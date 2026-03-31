const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");
const historyRoutes = require("./routes/history");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comments");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server THEMOVIE is running.");
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
