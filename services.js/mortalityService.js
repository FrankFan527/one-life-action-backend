const { mortalityData } = require("../data/sampleData");

/**
 * Get mortality information based on age band.
 * 
 * @param {string} ageBand - The age band for which to retrieve mortality information.
 * @returns {object} The mortality information for the specified age band.
 */
function getMortalityByAgeBand(ageBand) {

    // Validate age band
    if (!ageBand || typeof ageBand !== "string") {
        throw new Error("Age band is required.");
    }

    // Find mortality data matching the user's age band
    const result = mortalityData.find(
        (item) => item.ageBand === ageBand
    );

    // If no matching age band exists
    if (!result) {
        throw new Error(
            `No mortality data found for age band: ${ageBand}`
        );
    }

    return {
        ageBand: result.ageBand,
        leadingCauses: result.leadingCauses,
        source: result.source,
        reportingPeriod: result.reportingPeriod,

        disclaimer:
            "These figures describe population-level patterns. " +
            "They do not predict your future, calculate your individual risk, " +
            "or diagnose a medical condition."
    };
}


module.exports = {
    getMortalityByAgeBand
};