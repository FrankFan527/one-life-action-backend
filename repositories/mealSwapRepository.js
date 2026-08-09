const pool =
    require("../config/database");

async function findApprovedSwap(
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
            LIMIT 1
            `,
            [
                originalDishId,
                nutrient
            ]
        );

    return rows[0] || null;
}

module.exports = {
    findApprovedSwap
};