const {
    dishes,
    mealSwaps,
    nutrientConditions
} = require("../data/sampleData");

const {
    calculateTotals,
    GUIDELINES
} = require("./nutrientService");

/**
 * Find a dish by ID.
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
 * Find the meal contributing the highest amount
 * of the priority nutrient.
 *
 * selectedMeals are already ordered:
 * breakfast -> lunch -> tea -> dinner
 *
 * Because we only replace the current result when
 * the value is strictly greater, equal values keep
 * the earlier meal.
 */
function findHighestContributingMeal(
    selectedMeals,
    nutrientKey
) {

    let highestMeal = selectedMeals[0];

    for (const meal of selectedMeals) {

        if (
            Number(meal.dish[nutrientKey]) >
            Number(highestMeal.dish[nutrientKey])
        ) {
            highestMeal = meal;
        }
    }

    return highestMeal;
}

/**
 * Find an approved predefined swap.
 */
function findApprovedSwap(
    originalDishId,
    nutrientKey
) {

    const availableSwaps = mealSwaps.filter(
        (swap) =>
            String(swap.originalDishId) ===
                String(originalDishId) &&
            swap.targetNutrient === nutrientKey &&
            swap.approved === true
    );

    if (availableSwaps.length === 0) {
        return null;
    }

    // Lower rank number = preferred recommendation
    availableSwaps.sort(
        (a, b) => (a.rank || 999) - (b.rank || 999)
    );

    return availableSwaps[0];
}

/**
 * Retrieve approved nutrient-health explanation.
 */
function getNutrientCondition(nutrientKey) {

    return nutrientConditions.find(
        (item) => item.nutrient === nutrientKey
    ) || null;
}

/**
 * Main recommendation function.
 */
function getRecommendation(meals, nutrientResult) {

    // No priority nutrient means none exceeded
    if (!nutrientResult.priorityNutrient) {

        return {
            recommendationRequired: false,
            swapAvailable: false,
            message:
                "No assessed nutrient exceeds its guideline value."
        };
    }


    const priorityNutrient =
        nutrientResult.priorityNutrient;

    const nutrientKey =
        priorityNutrient.key;


    // Find the dish contributing the most
    const highestMeal =
        findHighestContributingMeal(
            nutrientResult.selectedMeals,
            nutrientKey
        );


    const originalDish =
        highestMeal.dish;


    // Find approved predefined swap
    const swap = findApprovedSwap(
        originalDish.dishId,
        nutrientKey
    );


    // Health explanation
    const healthRelationship =
        getNutrientCondition(nutrientKey);


    // No approved swap exists
    if (!swap) {

        return {
            recommendationRequired: true,
            swapAvailable: false,

            priorityNutrient: {
                key: nutrientKey,
                name: priorityNutrient.name,
                total: priorityNutrient.total,
                guideline: priorityNutrient.guideline,
                ratio: priorityNutrient.ratio
            },

            highestContributingMeal: {
                slot: highestMeal.slot,
                dish: originalDish
            },

            healthRelationship,

            message:
                "No validated swap is currently available for this dish."
        };
    }


    // Retrieve replacement dish
    const replacementDish =
        getDishById(swap.replacementDishId);


    // Replace the original dish virtually
    const revisedMeals =
        nutrientResult.selectedMeals.map((meal) => {

            if (meal.slot === highestMeal.slot) {
                return {
                    slot: meal.slot,
                    dish: replacementDish
                };
            }

            return meal;
        });


    // Recalculate all nutrient totals
    const revisedTotals =
        calculateTotals(revisedMeals);


    // Calculate measurable improvement
    const originalTotal =
        nutrientResult.totals[nutrientKey];

    const revisedTotal =
        revisedTotals[nutrientKey];

    const absoluteReduction =
        originalTotal - revisedTotal;

    const percentageReduction =
        originalTotal > 0
            ? (absoluteReduction / originalTotal) * 100
            : 0;


    const guideline =
        GUIDELINES[nutrientKey].limit;

    const withinGuideline =
        revisedTotal <= guideline;


    // Return recommendation
    return {
        recommendationRequired: true,
        swapAvailable: true,

        priorityNutrient: {
            key: nutrientKey,
            name: priorityNutrient.name,
            total: originalTotal,
            guideline,
            ratio: priorityNutrient.ratio
        },

        healthRelationship,

        recommendation: {
            mealSlot: highestMeal.slot,

            originalDish: {
                dishId: originalDish.dishId,
                name: originalDish.name
            },

            replacementDish: {
                dishId: replacementDish.dishId,
                name: replacementDish.name
            },

            reason:
                `${originalDish.name} contributes the most ` +
                `${priorityNutrient.name.toLowerCase()} ` +
                `among the selected meals.`,

            explanation: swap.explanation
        },

        impact: {
            originalTotal,
            revisedTotal,

            absoluteReduction:
                Number(absoluteReduction.toFixed(2)),

            percentageReduction:
                Number(percentageReduction.toFixed(1)),

            unit: GUIDELINES[nutrientKey].unit,

            guideline,

            withinGuideline,

            status: withinGuideline
                ? "The revised total is within the guideline value."
                : "The revised total remains above the guideline, but has been reduced."
        },

        revisedTotals
    };
}


module.exports = {
    getRecommendation,
    findHighestContributingMeal,
    findApprovedSwap,
    getNutrientCondition
};