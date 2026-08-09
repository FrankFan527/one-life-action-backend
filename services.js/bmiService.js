/**
 * Calculates the Body Mass Index (BMI) given height in centimeters and weight in kilograms.
 * @param {number} heightCm - Height in centimeters
 * @param {number} weightKg - Weight in kilograms
 * @returns {number} The calculated BMI
 */
function calculateBMI(heightCm, weightKg) {
    const height = Number(heightCm);
    const weight = Number(weightKg);

    // Validate input
    if (
        !Number.isFinite(height) ||
        !Number.isFinite(weight) ||
        height <= 0 ||
        weight <= 0
    ) {
        throw new Error("Height and weight must be positive numbers.");
    }

    // Convert centimetres to metres
    const heightMetres = height / 100;

    // Calculate BMI
    return weight / (heightMetres ** 2);
}

/**
 * Classifies the BMI into categories.
 * 
 * Underweight: < 18.5
 * Normal:      18.5 - 22.9
 * Overweight:  23.0 - 27.4
 * Obese:       >= 27.5
 * 
 * @param {number} bmi - The BMI value
 * @returns {string} The category of the BMI
 */
function classifyBMI(bmi) {
    if (!Number.isFinite(bmi) || bmi <= 0) {
        throw new Error("BMI must be a positive number.");
    }

    if (bmi < 18.5) {
        return "Underweight";
    }

    if (bmi < 23.0) {
        return "Normal";
    }

    if (bmi < 27.5) {
        return "Overweight";
    }

    return "Obese";
}

/**
 * Calculates the BMI and classifies it into a category.
 * 
 * @param {number} heightCm - Height in centimeters
 * @param {number} weightKg - Weight in kilograms
 * @returns {Object} An object containing the BMI, category, and disclaimer
 */
function getBMIResult(heightCm, weightKg) {
    const rawBMI = calculateBMI(heightCm, weightKg);
    const category = classifyBMI(rawBMI);

    return {
        bmi: Number(rawBMI.toFixed(1)),
        category,
        disclaimer: "BMI is a screening indicator and not a medical diagnosis."
    };
}

module.exports = {
    calculateBMI,
    classifyBMI,
    getBMIResult
};
