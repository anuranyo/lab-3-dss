const express = require("express");
const { getGoods, getGoodsDetails } = require("../controllers/goodsController");
const router = express.Router();

// Получить все товары
router.get("/", getGoods);

// Получить подробную информацию о товаре
router.get("/:id", getGoodsDetails);

module.exports = router;
