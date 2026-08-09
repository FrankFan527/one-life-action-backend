const bmiService = require("../services/bmiService");
const mortalityService = require("../services/mortalityService");
const nutrientService = require("../services/nutrientService");
const recommendationService = require("../services/recommendationService");

// Calculate BMI + get mortality information
const getHealthContext = async (req, res) => {
    try {
        const {
            ageBand,
            heightCm,
            weightKg
        } = req.body;

        // Check required fields
        if (
            ageBand === undefined ||
            heightCm === undefined ||
            weightKg === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Age band, height and weight are required."
            });
        }

        // BMI calculation
        const bmiResult = bmiService.getBMIResult(
            heightCm,
            weightKg
        );

        // Mortality information
        const mortalityResult =
            await mortalityService.getMortalityByAgeBand(ageBand);

        return res.status(200).json({
            success: true,
            healthContext: bmiResult,
            mortalityContext: mortalityResult
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Analyse meals and generate recommendation
const createMealAssessment = async (req, res) => {
    try {
        const { meals } = req.body;

        if (!meals) {
            return res.status(400).json({
                success: false,
                message: "Meals are required."
            });
        }

        // Calculate daily nutrient totals
        const nutrientResult =
            await nutrientService.analyseMeals(meals);

        // Generate meal swap recommendation
        const recommendation =
            await recommendationService.getRecommendation(
                meals,
                nutrientResult
            );

        return res.status(200).json({
            success: true,
            dailyAnalysis: {
                totals: nutrientResult.totals,
                nutrients: nutrientResult.nutrients,
                priorityNutrient:
                    nutrientResult.priorityNutrient,
                disclaimer:
                    nutrientResult.disclaimer
            },
            recommendation: recommendation
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getHealthContext,
    createMealAssessment
};