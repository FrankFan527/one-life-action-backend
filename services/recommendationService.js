const dishService =
    require("./dishService");

const nutrientConditionRepository =
    require(
        "../repositories/nutrientConditionRepository"
    );

const mealSwapRepository =
    require(
        "../repositories/mealSwapRepository"
    );

const {
    calculateTotals
} = require("./nutrientService");

const DB_NUTRIENT_MAP = {
    sugarG: "sugar",
    sodiumMg: "sodium",
    saturatedFatG: "sat_fat"
};

// Find the meal that contributes the most to a specific nutrient.
function findHighestContributingMeal(
    selectedMeals,
    nutrientKey
) {

    let highestMeal =
        selectedMeals[0];

    for (const meal of selectedMeals) {

        if (
            Number(
                meal.dish[nutrientKey]
            ) >
            Number(
                highestMeal.dish[
                    nutrientKey
                ]
            )
        ) {
            highestMeal = meal;
        }
    }

    return highestMeal;
}

// Find approved meal swaps for a specific dish and nutrient.
async function findApprovedSwaps(
    originalDishId,
    nutrientKey
) {

    const dbNutrient =
        DB_NUTRIENT_MAP[nutrientKey];

    console.log("Swap lookup:", {
        originalDishId,
        nutrientKey,
        dbNutrient
    });

    if (!dbNutrient) {
        throw new Error(
            `Unsupported nutrient: ${nutrientKey}`
        );
    }

    const swaps =
        await mealSwapRepository
            .findApprovedSwaps(
                originalDishId,
                dbNutrient
            );

    console.log(
        "Approved swaps returned:",
        swaps
    );

    return swaps;
}

// Get the health relationship for a specific nutrient.
async function getNutrientCondition(
    nutrientKey
) {

    const dbNutrient =
        DB_NUTRIENT_MAP[nutrientKey];

    if (!dbNutrient) {
        throw new Error(
            `Unsupported nutrient: ${nutrientKey}`
        );
    }

    return nutrientConditionRepository
        .getByNutrient(dbNutrient);
}

// Generate a meal swap recommendation based on the selected meals and nutrient analysis.
async function getRecommendation(nutrientResult) {

    // If no nutrient exceeds its guideline, no recommendation is needed.
    if (
        !nutrientResult
            .priorityNutrient
    ) {
        return {
            recommendationRequired: false,
            swapAvailable: false,
            message:
                "No assessed nutrient exceeds its guideline value."
        };
    }

    const priorityNutrient =
        nutrientResult
            .priorityNutrient;

    const nutrientKey =
        priorityNutrient.key;

    const highestMeal =
        findHighestContributingMeal(
            nutrientResult.selectedMeals,
            nutrientKey
        );

    const originalDish =
        highestMeal.dish;

    const swaps =
        await findApprovedSwaps(
            originalDish.dishId,
            nutrientKey
        );

    console.log("Found swaps:", swaps);

    const healthRelationship =
        await getNutrientCondition(
            nutrientKey
        );
    
    // If no swap is found, return a recommendation indicating that no validated swap is available.
    if (!swaps || swaps.length === 0) {

        return {
            recommendationRequired: true,
            swapAvailable: false,

            priorityNutrient: {
                key: nutrientKey,
                name:
                    priorityNutrient.name,
                total:
                    priorityNutrient.total,
                guideline:
                    priorityNutrient.guideline,
                ratio:
                    priorityNutrient.ratio
            },

            highestContributingMeal: {
                slot:
                    highestMeal.slot,
                dish:
                    originalDish
            },

            healthRelationship,
            recommendations: [],
            message:
                "No validated swap is currently available for this dish."
        };
    }

    const recommendations = [];

    // For each approved swap, calculate the impact on the nutrient and prepare a recommendation.
    for (const swap of swaps) {

        // Skip swaps that do not have a valid replacement dish.
        if (!swap.to_dish_id) {
            continue;
        }

        const replacementDish =
            await dishService.getDishById(
                swap.to_dish_id
            );

        // Replace only the targeted meal
        const revisedMeals =
            nutrientResult.selectedMeals.map(
                (meal) => {

                    if (
                        meal.slot ===
                        highestMeal.slot
                    ) {
                        return {
                            slot: meal.slot,
                            dish: replacementDish
                        };
                    }

                    return meal;
                }
            );


        // Recalculate daily totals
        const revisedTotals =
            calculateTotals(
                revisedMeals
            );


        const originalTotal =
            nutrientResult
                .totals[nutrientKey];

        const revisedTotal =
            revisedTotals[nutrientKey];


        const absoluteReduction =
            originalTotal -
            revisedTotal;


        // Ignore swaps that make the nutrient worse
        if (absoluteReduction <= 0) {
            continue;
        }


        const percentageReduction =
            originalTotal > 0
                ? (
                    absoluteReduction /
                    originalTotal
                ) * 100
                : 0;


        const guideline =
            priorityNutrient.guideline;


        const withinGuideline =
            revisedTotal <= guideline;


        recommendations.push({

            swapId: swap.swap_id,

            mealSlot:
                highestMeal.slot,

            originalDish: {
                dishId:
                    originalDish.dishId,
                name:
                    originalDish.name
            },

            replacementDish: {
                dishId:
                    replacementDish.dishId,
                name:
                    replacementDish.name
            },

            reason:
                `${originalDish.name} contributes the most ` +
                `${priorityNutrient.name.toLowerCase()} ` +
                `among the selected meals.`,

            explanation:
                swap.explanation,

            approxReduction:
                swap.approx_reduction,

            realismLevel:
                swap.realism_level,

            impact: {
                originalTotal,
                revisedTotal,

                absoluteReduction:
                    Number(
                        absoluteReduction
                            .toFixed(2)
                    ),

                percentageReduction:
                    Number(
                        percentageReduction
                            .toFixed(1)
                    ),

                unit:
                    priorityNutrient.unit,

                guideline,

                withinGuideline,

                status:
                    withinGuideline
                        ? "The revised total is within the guideline value."
                        : "The revised total remains above the guideline, but has been reduced."
            },

            revisedTotals
        });
    }

    // Database swaps existed, but none resulted in a valid reduction for the nutrient.
    if (recommendations.length === 0) {
        return {
            recommendationRequired: true,
            swapAvailable: false,

            priorityNutrient: {
                key: nutrientKey,
                name: priorityNutrient.name,
                total:
                    nutrientResult.totals[
                        nutrientKey
                    ],
                guideline:
                    priorityNutrient.guideline,
                ratio:
                    priorityNutrient.ratio
            },

            highestContributingMeal: {
                slot: highestMeal.slot,
                dish: originalDish
            },

            healthRelationship,

            recommendations: [],

            message:
                "No validated swap with a measurable nutrient reduction is currently available."
        };
    }

    console.log("Final recommendations:", recommendations);

    return {
        recommendationRequired: true,

        swapAvailable: true,

        priorityNutrient: {
            key: nutrientKey,
            name: priorityNutrient.name,
            total: nutrientResult.totals[nutrientKey],
            guideline: priorityNutrient.guideline,
            ratio: priorityNutrient.ratio
        },

        healthRelationship,

        recommendations
    };
}


module.exports = {
    getRecommendation,
    findHighestContributingMeal,
    findApprovedSwaps,
    getNutrientCondition
};