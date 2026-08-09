const express = require("express");

const {
    getHealthContext,
    createMealAssessment
} = require("../controllers/assessmentController");

const {
    getDishes
} = require("../controllers/dishController");

const router = express.Router();

router.post("/health-context", getHealthContext);

router.post("/meal-assessment", createMealAssessment);

router.get("/dishes", getDishes);

module.exports = router;