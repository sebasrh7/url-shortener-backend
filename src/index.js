import express from "express";
import bodyParser from "body-parser";
import router from "./routes/router.js";
import dotenv from "dotenv";

// Initialize Express
const app = express();

// Load environment variables
dotenv.config();

// Bodyparser Middleware
app.use(bodyParser.json());

// Routes
app.use(router);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
