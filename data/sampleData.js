const dishes = [
    {
        dishId: 1,
        name: "Dish A",
        energyKcal: 500,
        sugarG: 10,
        saturatedFatG: 8,
        sodiumMg: 700
    },
    {
        dishId: 2,
        name: "Dish B",
        energyKcal: 450,
        sugarG: 5,
        saturatedFatG: 5,
        sodiumMg: 400
    },
    {
        dishId: 3,
        name: "Dish C",
        energyKcal: 300,
        sugarG: 20,
        saturatedFatG: 4,
        sodiumMg: 300
    },
    {
        dishId: 4,
        name: "Dish D",
        energyKcal: 600,
        sugarG: 15,
        saturatedFatG: 10,
        sodiumMg: 1000
    },
    {
        dishId: 5,
        name: "Lower Sodium Dish",
        energyKcal: 450,
        sugarG: 8,
        saturatedFatG: 6,
        sodiumMg: 350
    }
];

const mealSwaps = [
    {
        originalDishId: 4,
        replacementDishId: 5,

        targetNutrient: "sodiumMg",

        approved: true,

        rank: 1,

        explanation:
            "This replacement contains less sodium while remaining a realistic meal option."
    }
];

const nutrientConditions = [
    {
        nutrient: "sugarG",

        condition:
            "Blood-glucose regulation, insulin resistance and type-2 diabetes",

        explanation:
            "Higher sugar intake is associated with blood-glucose regulation, insulin resistance and type-2 diabetes."
    },

    {
        nutrient: "saturatedFatG",

        condition:
            "Raised LDL cholesterol and ischaemic heart disease",

        explanation:
            "Higher saturated-fat intake is associated with raised LDL cholesterol and ischaemic heart disease."
    },

    {
        nutrient: "sodiumMg",

        condition:
            "Raised blood pressure, heart disease and stroke",

        explanation:
            "Higher sodium intake is associated with raised blood pressure, heart disease and stroke."
    }
];

const mortalityData = [
    {
        ageBand: "30-39",
        leadingCauses: [
            {
                rank: 1,
                cause: "Example cause 1"
            },
            {
                rank: 2,
                cause: "Example cause 2"
            },
            {
                rank: 3,
                cause: "Example cause 3"
            }
        ],
        source: "DOSM",
        reportingPeriod: "YOUR DATASET PERIOD"
    },

    {
        ageBand: "40-49",
        leadingCauses: [
            {
                rank: 1,
                cause: "Example cause 1"
            },
            {
                rank: 2,
                cause: "Example cause 2"
            },
            {
                rank: 3,
                cause: "Example cause 3"
            }
        ],
        source: "DOSM",
        reportingPeriod: "YOUR DATASET PERIOD"
    }
];

module.exports = {
    mortalityData,
    dishes,
    mealSwaps,
    nutrientConditions
};