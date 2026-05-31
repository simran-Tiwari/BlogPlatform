require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");

const DBConnect = require("./config/DbConfig");
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const errorHandler = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoute");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Connect DB
DBConnect();

// Middlewares
app.use(express.json());
app.use(loggerMiddleware);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use("/api", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});