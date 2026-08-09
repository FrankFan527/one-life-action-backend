const dishRepository = require("../repositories/dishRepository");

async function getAllDishes() {

    const dishes = await dishRepository.getAllDishes();

    return dishes.map((dish) => ({
        dishId: dish.dish_id,
        name: dish.name,
        category: dish.category,
        mealSlot: dish.meal_slot,
        servingDescription: dish.serving_description,
        energyKcal: Number(dish.energy_kcal),
        sugarG: Number(dish.sugar_g),
        saturatedFatG: Number(dish.sat_fat_g),
        sodiumMg: Number(dish.sodium_mg)
    }));
}

async function getDishById(dishId) {

    if (!dishId) {
        throw new Error("Dish ID is required.");
    }

    const dish = await dishRepository.getDishById(dishId);

    if (!dish) {
        throw new Error(`Dish not found: ${dishId}`);
    }

    return {
        dishId: dish.dish_id,
        name: dish.name,
        category: dish.category,
        mealSlot: dish.meal_slot,
        servingDescription: dish.serving_description,
        energyKcal: Number(dish.energy_kcal),
        sugarG: Number(dish.sugar_g),
        saturatedFatG: Number(dish.sat_fat_g),
        sodiumMg: Number(dish.sodium_mg)
    };
}

module.exports = {
    getAllDishes,
    getDishById
};