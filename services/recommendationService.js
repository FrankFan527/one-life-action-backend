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


async function findApprovedSwap(
    originalDishId,
    nutrientKey
) {

    const dbNutrient =
        DB_NUTRIENT_MAP[nutrientKey];

    if (!dbNutrient) {
        throw new Error(
            `Unsupported nutrient: ${nutrientKey}`
        );
    }

    return mealSwapRepository
        .findApprovedSwap(
            originalDishId,
            dbNutrient
        );
}


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


async function getRecommendation(
    meals,
    nutrientResult
) {

    if (
        !nutrientResult
            .priorityNutrient
    ) {
        return {
            recommendationRequired:
                false,

            swapAvailable:
                false,

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

    const swap =
        await findApprovedSwap(
            originalDish.dishId,
            nutrientKey
        );

    const healthRelationship =
        await getNutrientCondition(
            nutrientKey
        );

    if (!swap) {

        return {
            recommendationRequired:
                true,

            swapAvailable:
                false,

            priorityNutrient: {
                key: nutrientKey,
                name:
                    priorityNutrient.name,
                total:
                    priorityNutrient.total,
                guideline:
                    priorityNutrient
                        .guideline,
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

            message:
                "No validated swap is currently available for this dish."
        };
    }

    let replacementDish = null;

    if (swap.to_dish_id) {
        replacementDish =
            await dishService.getDishById(
                swap.to_dish_id
            );
    }

    if (!replacementDish) {

        return {
            recommendationRequired: true,
            swapAvailable: true,

            priorityNutrient,

            healthRelationship,

            recommendation: {
                mealSlot:
                    highestMeal.slot,

                originalDish: {
                    dishId:
                        originalDish.dishId,
                    name:
                        originalDish.name
                },

                replacementDish: {
                    dishId: null,
                    name:
                        swap.to_swap_name
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
                    swap.realism_level
            },

            revisedTotals: null
        };
    }

    const revisedMeals =
        nutrientResult
            .selectedMeals
            .map((meal) => {

                if (
                    meal.slot ===
                    highestMeal.slot
                ) {
                    return {
                        slot:
                            meal.slot,
                        dish:
                            replacementDish
                    };
                }

                return meal;
            });

    const revisedTotals =
        calculateTotals(
            revisedMeals
        );

    const originalTotal =
        nutrientResult
            .totals[nutrientKey];

    const revisedTotal =
        revisedTotals[
            nutrientKey
        ];

    const absoluteReduction =
        originalTotal -
        revisedTotal;

    const percentageReduction =
        originalTotal > 0
            ? (
                absoluteReduction /
                originalTotal
            ) * 100
            : 0;

    const guideline =
        priorityNutrient
            .guideline;

    const withinGuideline =
        revisedTotal <=
        guideline;

    return {
        recommendationRequired:
            true,

        swapAvailable:
            true,

        priorityNutrient: {
            key:
                nutrientKey,
            name:
                priorityNutrient.name,
            total:
                originalTotal,
            guideline,
            ratio:
                priorityNutrient.ratio
        },

        healthRelationship,

        recommendation: {
            swapId:
                swap.swap_id,

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
                    replacementDish
                        .dishId,
                name:
                    replacementDish
                        .name
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
                swap.realism_level
        },

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
    };
}


module.exports = {
    getRecommendation,
    findHighestContributingMeal,
    findApprovedSwap,
    getNutrientCondition
};