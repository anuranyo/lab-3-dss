const { executeQuery } = require("../config/dbConfig");

// Получить все товары
const getGoods = async (req, res) => {
  try {
    const query = "SELECT * FROM Goods";
    const result = await executeQuery(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching goods", error: error.message });
  }
};

// Получить подробную информацию о товаре и продажах
const getGoodsDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT g.Good_Id, g.Name, g.Price, g.Quantity, g.Producer, g.Description,
             s.Sale_Id, s.Date_Sale, s.Quantity AS Sold_Quantity, s.Total_Amount
      FROM Goods g
      LEFT JOIN Sales s ON g.Good_Id = s.Good_Id
      WHERE g.Good_Id = ${id};
    `;
    const result = await executeQuery(query);

    if (result.length === 0) {
      return res.status(404).json({ message: "No details found for this product" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details", error: error.message });
  }
};

module.exports = { getGoods, getGoodsDetails };
