require("dotenv").config();

const express = require("express");
const cors = require("cors");

const assessmentRoutes = require("./routes/assessmentRoutes");
const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Basic backend test
app.get("/", (req, res) => {
    res.json({
        message: "FIT5120 backend is running"
    });
});


// Temporary database connection test
app.get("/db-test", async (req, res) => {
    try {

        const [rows] = await pool.query(
            "SELECT NOW() AS currentTime"
        );

        res.json({
            success: true,
            message: "Aiven MySQL connected successfully",
            databaseTime: rows[0].currentTime
        });

    } catch (error) {

        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});


// Assessment API
app.use("/assessment", assessmentRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;