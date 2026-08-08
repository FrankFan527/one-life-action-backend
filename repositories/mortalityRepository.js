const pool = require("../config/database");

/**
 * Retrieve mortality statistics for an age band.
 *
 * Uses the most recent year available for that age band.
 *
 * @param {string} ageBand
 * @returns {Promise<Array>}
 */
async function getMortalityByAgeBand(ageBand) {

    const [rows] = await pool.execute(
        `
        SELECT
            ab.label AS age_band,
            ms.year,
            ms.deaths_count,
            ms.percentage,
            ms.source,
            cod.cause_id,
            cod.name AS cause_name,
            cod.description AS cause_description
        FROM age_band ab
        JOIN mortality_statistic ms
            ON ab.age_band_id = ms.age_band_id
        JOIN cause_of_death cod
            ON ms.cause_id = cod.cause_id
        WHERE ab.label = ?
          AND ms.year = (
              SELECT MAX(ms2.year)
              FROM mortality_statistic ms2
              WHERE ms2.age_band_id = ab.age_band_id
          )
        ORDER BY ms.percentage DESC
        `,
        [ageBand]
    );

    return rows;
}

module.exports = {
    getMortalityByAgeBand
};