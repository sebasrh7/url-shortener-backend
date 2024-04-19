import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "./passport/passport.js";
import bodyParser from "body-parser";
import router from "./routes/router.js";
import dotenv from "dotenv";

// Initialize Express
const app = express();

// Load environment variables
dotenv.config();

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Bodyparser Middleware
app.use(bodyParser.json());

// Routes
app.use(router);

// Connect to MongoDB
const uri = process.env.DATABASE_URL;
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
