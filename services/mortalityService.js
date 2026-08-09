const mortalityRepository = require("../repositories/mortalityRepository");

/**
 * Get mortality information based on age band.
 *
 * @param {string} ageBand
 * @returns {Promise<object>}
 */
async function getMortalityByAgeBand(ageBand) {

    // Validate age band
    if (!ageBand || typeof ageBand !== "string") {
        throw new Error("Age band is required.");
    }

    // Retrieve mortality data from Aiven MySQL
    const rows =
        await mortalityRepository.getMortalityByAgeBand(ageBand);

    // No matching age band / mortality statistics
    if (!rows || rows.length === 0) {
        throw new Error(
            `No mortality data found for age band: ${ageBand}`
        );
    }

    const leadingCauses = rows.map((row) => ({
        causeId: row.cause_id,
        name: row.cause_name,
        description: row.cause_description,
        deathsCount:
            row.deaths_count === null
                ? null
                : Number(row.deaths_count),
        percentage: Number(row.percentage)
    }));

    return {
        ageBand: rows[0].age_band,

        leadingCauses,

        source: rows[0].source,

        reportingPeriod: String(rows[0].year),

        disclaimer:
            "These figures describe population-level patterns. " +
            "They do not predict your future, calculate your individual risk, " +
            "or diagnose a medical condition."
    };
}

module.exports = {
    getMortalityByAgeBand
};