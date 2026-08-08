const pool = require("../config/database");

async function getAllGuidelines() {

    const [rows] = await pool.query(`
        SELECT
            nutrient,
            daily_limit,
            unit,
            basis,
            source
        FROM guideline
    `);

    return rows;
}

module.exports = {
    getAllGuidelines
};