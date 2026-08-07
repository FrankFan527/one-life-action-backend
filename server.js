const express = require("express");
const cors = require("cors");

const recommendationRoutes = require("./routes/recommendation");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Basic test interface
app.get("/", (req, res) => {
  res.json({
    message: "FIT5120 backend is running"
  });
});

// Recommendation API
app.use("/recommendation", recommendationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});