const pool =
    require("../config/database");

async function findApprovedSwaps(
    originalDishId,
    nutrient
) {

    const [rows] =
        await pool.execute(
            `
            SELECT
                swap_id,
                from_dish_id,
                to_dish_id,
                to_swap_name,
                nutrient_reduced,
                approx_reduction,
                realism_level,
                condition_targeted,
                explanation
            FROM swap
            WHERE from_dish_id = ?
              AND nutrient_reduced = ?
            ORDER BY swap_id
            LIMIT 3
            `,
            [
                originalDishId,
                nutrient
            ]
        );

    return rows;
}

module.exports = {
    findApprovedSwaps
};