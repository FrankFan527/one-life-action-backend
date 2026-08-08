const { dishes } = require("../data/sampleData");

const MEAL_ORDER = [
    "breakfast",
    "lunch",
    "tea",
    "dinner"
];

const GUIDELINES = {
    sugarG: {
        name: "Sugar",
        limit: 25,
        unit: "g"
    },

    sodiumMg: {
        name: "Sodium",
        limit: 2000,
        unit: "mg"
    },

    saturatedFatG: {
        name: "Saturated Fat",
        limit: 20,
        unit: "g"
    }
};

// Tie-breaking priority:
// Sodium > Sugar > Saturated Fat
// We can change it later if needed.
const NUTRIENT_PRIORITY = [
    "sodiumMg",
    "sugarG",
    "saturatedFatG"
];

/**
 * Find a dish from data.
 */
function getDishById(dishId) {
    const dish = dishes.find(
        (item) => String(item.dishId) === String(dishId)
    );

    if (!dish) {
        throw new Error(`Dish not found: ${dishId}`);
    }

    return dish;
}

/**
 * Validate that all four meal slots have been selected.
 */
function validateMeals(meals) {

    if (!meals || typeof meals !== "object") {
        throw new Error("Meals are required.");
    }

    const missingSlots = MEAL_ORDER.filter(
        (slot) =>
            meals[slot] === undefined ||
            meals[slot] === null ||
            meals[slot] === ""
    );

    if (missingSlots.length > 0) {
        throw new Error(
            `Missing meal selections: ${missingSlots.join(", ")}`
        );
    }
}

/**
 * Calculate total nutrients from selected meals.
 *
 * selectedMeals should contain:
 * [
 *   { slot: "breakfast", dish: {...} },
 *   ...
 * ]
 */
function calculateTotals(selectedMeals) {

    return selectedMeals.reduce(
        (totals, meal) => {

            const dish = meal.dish;

            totals.energyKcal += Number(dish.energyKcal) || 0;
            totals.sugarG += Number(dish.sugarG) || 0;
            totals.saturatedFatG +=
                Number(dish.saturatedFatG) || 0;
            totals.sodiumMg += Number(dish.sodiumMg) || 0;

            return totals;
        },
        {
            energyKcal: 0,
            sugarG: 0,
            saturatedFatG: 0,
            sodiumMg: 0
        }
    );
}

/**
 * Compare daily nutrient totals with guideline values.
 */
function compareWithGuidelines(totals) {

    const nutrientAnalysis = {};

    for (const nutrientKey of Object.keys(GUIDELINES)) {

        const guideline = GUIDELINES[nutrientKey];
        const total = totals[nutrientKey];

        const ratio = total / guideline.limit;

        nutrientAnalysis[nutrientKey] = {
            name: guideline.name,
            total,
            guideline: guideline.limit,
            unit: guideline.unit,
            exceeded: total > guideline.limit,
            ratio: Number(ratio.toFixed(2))
        };
    }

    return nutrientAnalysis;
}

/**
 * Find the nutrient with the highest exceedance ratio.
 *
 * If ratios are equal:
 * Sodium > Sugar > Saturated Fat
 */
function findPriorityNutrient(nutrientAnalysis) {

    const exceeded = NUTRIENT_PRIORITY.filter(
        (nutrientKey) =>
            nutrientAnalysis[nutrientKey].exceeded
    );

    // No nutrients exceed the guideline
    if (exceeded.length === 0) {
        return null;
    }

    let priorityKey = exceeded[0];

    for (const nutrientKey of exceeded) {

        const currentRatio =
            nutrientAnalysis[nutrientKey].ratio;

        const priorityRatio =
            nutrientAnalysis[priorityKey].ratio;

        // Only replace when strictly greater.
        // This preserves:
        // Sodium > Sugar > Saturated Fat
        // when ratios are equal.
        if (currentRatio > priorityRatio) {
            priorityKey = nutrientKey;
        }
    }

    return {
        key: priorityKey,
        ...nutrientAnalysis[priorityKey]
    };
}

/**
 * Main function used by the controller.
 */
function analyseMeals(meals) {

    // Make sure all four meals exist
    validateMeals(meals);

    // Retrieve approved dish data
    const selectedMeals = MEAL_ORDER.map((slot) => {

        const dish = getDishById(meals[slot]);

        return {
            slot,
            dish
        };
    });

    // Sum nutrients
    const totals = calculateTotals(selectedMeals);

    // Compare against guidelines
    const nutrients = compareWithGuidelines(totals);

    // Determine highest-priority nutrient
    const priorityNutrient =
        findPriorityNutrient(nutrients);

    return {
        selectedMeals,
        totals,
        nutrients,
        priorityNutrient,

        disclaimer:
            "These guideline values are general reference values and are not personalised medical advice."
    };
}


module.exports = {
    analyseMeals,
    calculateTotals,
    compareWithGuidelines,
    findPriorityNutrient,
    getDishById,
    GUIDELINES,
    MEAL_ORDER
};