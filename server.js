const express = require("express");
const cors = require("cors");

const assessmentRoutes = require("./routes/assessmentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic test interface
app.get("/", (req, res) => {
  res.json({
    message: "FIT5120 backend is running"
  });
});

// Assessment API
app.use("/assessment", assessmentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;