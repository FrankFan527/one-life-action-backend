const pool =
    require("../config/database");

async function getByNutrient(
    nutrient
) {

    const [rows] =
        await pool.execute(
            `
            SELECT
                nc.nc_id,
                nc.nutrient,
                nc.condition_name,
                nc.mechanism,
                nc.source,
                c.name AS cause_of_death
            FROM nutrient_condition nc
            LEFT JOIN cause_of_death c
                ON c.cause_id =
                   nc.cause_id
            WHERE nc.nutrient = ?
            `,
            [nutrient]
        );

    return rows;
}

module.exports = {
    getByNutrient
};