require("dotenv").config();

const express = require("express");
const cors = require("cors");

const assessmentRoutes = require("./routes/assessmentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: only allow the deployed frontend
app.use(
    cors({
        origin: "https://one-life-action-frontend.vercel.app",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FIT5120 backend is running"
    });
});

// Assessment APIs
app.use("/assessment", assessmentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;