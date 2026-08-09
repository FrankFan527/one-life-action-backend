const { dishes } = require("../data/sampleData");

function getAllDishes() {
    return dishes.map((dish) => ({
        dishId: dish.dishId,
        name: dish.name,
        energyKcal: dish.energyKcal,
        sugarG: dish.sugarG,
        saturatedFatG: dish.saturatedFatG,
        sodiumMg: dish.sodiumMg
    }));
}

function getDishById(dishId) {

    const dish = dishes.find(
        (item) => String(item.dishId) === String(dishId)
    );

    if (!dish) {
        throw new Error(`Dish not found: ${dishId}`);
    }

    return dish;
}

module.exports = {
    getAllDishes,
    getDishById
};