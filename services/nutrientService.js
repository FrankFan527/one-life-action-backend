const dishService = require("./dishService");
const guidelineRepository =
    require("../repositories/guidelineRepository");

const MEAL_ORDER = [
    "breakfast",
    "lunch",
    "tea",
    "dinner"
];

// Tie-breaking priority:
// Sodium > Sugar > Saturated Fat
const NUTRIENT_PRIORITY = [
    "sodiumMg",
    "sugarG",
    "saturatedFatG"
];

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

function calculateTotals(selectedMeals) {

    return selectedMeals.reduce(
        (totals, meal) => {

            const dish = meal.dish;

            totals.energyKcal +=
                Number(dish.energyKcal) || 0;

            totals.sugarG +=
                Number(dish.sugarG) || 0;

            totals.saturatedFatG +=
                Number(dish.saturatedFatG) || 0;

            totals.sodiumMg +=
                Number(dish.sodiumMg) || 0;

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

function mapGuidelines(rows) {

    const guidelines = {};

    for (const row of rows) {

        if (row.nutrient === "sugar") {
            guidelines.sugarG = {
                name: "Sugar",
                limit: Number(row.daily_limit),
                unit: row.unit,
                basis: row.basis,
                source: row.source
            };
        }

        if (row.nutrient === "sodium") {
            guidelines.sodiumMg = {
                name: "Sodium",
                limit: Number(row.daily_limit),
                unit: row.unit,
                basis: row.basis,
                source: row.source
            };
        }

        if (row.nutrient === "sat_fat") {
            guidelines.saturatedFatG = {
                name: "Saturated Fat",
                limit: Number(row.daily_limit),
                unit: row.unit,
                basis: row.basis,
                source: row.source
            };
        }
    }

    return guidelines;
}

function compareWithGuidelines(totals, guidelines) {

    const nutrientAnalysis = {};

    for (const nutrientKey of Object.keys(guidelines)) {

        const guideline = guidelines[nutrientKey];
        const total = totals[nutrientKey];

        const ratio =
            total / guideline.limit;

        nutrientAnalysis[nutrientKey] = {
            name: guideline.name,
            total,
            guideline: guideline.limit,
            unit: guideline.unit,
            basis: guideline.basis,
            source: guideline.source,
            exceeded:
                total > guideline.limit,
            ratio:
                Number(ratio.toFixed(2))
        };
    }

    return nutrientAnalysis;
}

function findPriorityNutrient(
    nutrientAnalysis
) {

    const exceeded =
        NUTRIENT_PRIORITY.filter(
            (nutrientKey) =>
                nutrientAnalysis[nutrientKey]
                    .exceeded
        );

    if (exceeded.length === 0) {
        return null;
    }

    let priorityKey = exceeded[0];

    for (const nutrientKey of exceeded) {

        const currentRatio =
            nutrientAnalysis[nutrientKey]
                .ratio;

        const priorityRatio =
            nutrientAnalysis[priorityKey]
                .ratio;

        if (currentRatio > priorityRatio) {
            priorityKey = nutrientKey;
        }
    }

    return {
        key: priorityKey,
        ...nutrientAnalysis[priorityKey]
    };
}

async function analyseMeals(meals) {

    validateMeals(meals);

    const selectedMeals = [];

    for (const slot of MEAL_ORDER) {

        const dish =
            await dishService.getDishById(
                meals[slot]
            );

        selectedMeals.push({
            slot,
            dish
        });
    }

    const totals =
        calculateTotals(selectedMeals);

    const guidelineRows =
        await guidelineRepository
            .getAllGuidelines();

    const guidelines =
        mapGuidelines(guidelineRows);

    const nutrients =
        compareWithGuidelines(
            totals,
            guidelines
        );

    const priorityNutrient =
        findPriorityNutrient(nutrients);

    return {
        selectedMeals,
        totals,
        nutrients,
        priorityNutrient,
        guidelines,

        disclaimer:
            "These guideline values are general reference values and are not personalised medical advice."
    };
}

module.exports = {
    analyseMeals,
    calculateTotals,
    compareWithGuidelines,
    findPriorityNutrient,
    validateMeals,
    mapGuidelines,
    MEAL_ORDER
};