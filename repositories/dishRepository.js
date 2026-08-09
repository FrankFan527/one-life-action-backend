const pool = require("../config/database");

async function getAllDishes() {

    const [rows] = await pool.query(`
        SELECT
            d.dish_id,
            d.name,
            d.category,
            d.meal_slot,
            d.serving_description,
            dn.energy_kcal,
            dn.sugar_g,
            dn.sat_fat_g,
            dn.sodium_mg
        FROM dish d
        JOIN dish_nutrient dn
            ON d.dish_id = dn.dish_id
        ORDER BY d.dish_id
    `);

    return rows;
}

async function getDishById(dishId) {

    const [rows] = await pool.execute(`
        SELECT
            d.dish_id,
            d.name,
            d.category,
            d.meal_slot,
            d.serving_description,
            dn.energy_kcal,
            dn.sugar_g,
            dn.sat_fat_g,
            dn.sodium_mg
        FROM dish d
        JOIN dish_nutrient dn
            ON d.dish_id = dn.dish_id
        WHERE d.dish_id = ?
    `, [dishId]);

    return rows[0] || null;
}


module.exports = {
    getAllDishes,
    getDishById
};