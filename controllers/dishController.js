const dishService = require("../services/dishService");

const getDishes = async (req, res) => {
    try {

        const dishes = await dishService.getAllDishes();

        return res.status(200).json({
            success: true,
            dishes
        });

    } catch (error) {

        console.error("Get dishes error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDishes
};