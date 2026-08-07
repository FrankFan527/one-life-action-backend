const recommendations = require("../data/sampleData");

const getRecommendation = (req, res) => {
const { age, bmi, smoking } = req.body;

// Check required data

if (age === undefined || bmi === undefined || smoking === undefined) {

return res.status(400).json({
success: false,

message: "age, bmi and smoking are required"

});

}

let riskLevel = "low";

// Temporarily use simple rules as sample logic

if (bmi >= 30 || smoking === true) {

riskLevel = "high";

} else if (bmi >= 25 || age >= 40) {

riskLevel = "medium";

}

return res.status(200).json({
success: true,

input: {

age,

bmi,

smoking

}, 
riskLevel, 
recommendations: recommendations[riskLevel] 
});
};

module.exports = { 
getRecommendation
};