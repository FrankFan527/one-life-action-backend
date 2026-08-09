const dishService = require("../services/dishService");

const getDishes = (req, res) => {

    try {

        const dishes = dishService.getAllDishes();

        return res.status(200).json({
            success: true,
            dishes
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDishes
};