const express = require("express");
const {
 getTopSellingGoods,
 getLargestOrder,
 updateGoodsDiscount,
 getGoods,
 getWorkers,
 getSalesByGoodId,
 getGoodById,
} = require("../controllers/apiController");

const router = express.Router();



// Маршрут отримання працівників
router.get("/workers", getWorkers);

// Маршрут для отримання товарів
router.get("/goods", getGoods);

router.get("/goods/:id", getGoodById);

router.get("/sales/:goodId", getSalesByGoodId);

// Маршрут до виконання функції " GetTopSellingGoods "
router.get("/functions/top-selling-goods", getTopSellingGoods);

// Маршрут для функції GetLargestOrder
router.get("/functions/largest-order", getLargestOrder);

router.post("/procedures/update-goods-discount", updateGoodsDiscount);


module.exports = router;