const { executeQuery, TYPES } = require("../config/dbConfig");

// Получение всех товаров
const getGoods = async (req, res) => {
  try {
    const query = "SELECT Good_Id, Name, Price, Quantity, Producer, Description FROM Goods";
    const result = await executeQuery(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching goods:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Получение всех работников
const getWorkers = async (req, res) => {
  try {
    const query = "SELECT Worker_Id, Name, Position, Dept_Id FROM Workers";
    const result = await executeQuery(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching workers:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Получение самых продаваемых товаров по имени работника
const getTopSellingGoods = async (req, res) => {
    try {
      const { workerName } = req.query;
  
      if (!workerName) {
        return res.status(400).json({ error: "Worker name is required." });
      }
  
      // SQL-запрос с именованным параметром
      const query = `
        SELECT Worker_Name, Dept_Name, Good_Name, Total_Sold
        FROM dbo.GetTopSellingGoods(@WorkerName);
      `;
  
      // Выполнение запроса с параметром
      const result = await executeQuery(query, { WorkerName: workerName });
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No data found for the given worker." });
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching top-selling goods:", error.message);
      res.status(500).json({ error: error.message });
    }
  };


// Получение самого большого заказа по названию товара
const getLargestOrder = async (req, res) => {
  try {
    const { goodName } = req.query;

    if (!goodName) {
      return res.status(400).json({ error: "Good name is required." });
    }

    const query = `
      SELECT Sale_Id, Check_No, Good_Name, Quantity, Total_Amount, Date_Sale
      FROM dbo.GetLargestOrder(@GoodName);
    `;

    const result = await executeQuery(query, [
      { name: "GoodName", type: TYPES.NVarChar, value: goodName },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found for the given good name." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching largest order:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Обновление скидки для товара
const updateGoodsDiscount = async (req, res) => {
    try {
      const { goodName, discountPercent } = req.body;
  
      if (!goodName || discountPercent === undefined) {
        return res.status(400).json({ error: "Good name and discount percent are required." });
      }
  
      // Вызов процедуры с параметрами
      const query = `EXEC UpdateGoodsDiscount @GoodName, @DiscountPercent`;
      const parameters = [
        { name: "GoodName", type: TYPES.NVarChar, value: goodName },
        { name: "DiscountPercent", type: TYPES.Int, value: discountPercent },
      ];
  
      await executeQuery(query, parameters);
  
      // После обновления получаем все товары
      const result = await executeQuery("SELECT Good_Id, Name, Price, Description FROM Goods");
  
      res.status(200).json({
        message: `Discount for "${goodName}" updated successfully.`,
        goods: result,
      });
    } catch (error) {
      console.error("Error updating goods discount:", error.message);
      res.status(500).json({ error: error.message });
    }
  };

  const getGoodById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = "SELECT Good_Id, Name, Price, Quantity, Producer, Description FROM Goods WHERE Good_Id = @id";
  
      const result = await executeQuery(query, [{ name: "id", type: TYPES.Int, value: id }]);
  
      if (result.length === 0) {
        return res.status(404).json({ error: "Good not found" });
      }
  
      res.status(200).json(result[0]);
    } catch (error) {
      console.error("Error fetching good by ID:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  const getSalesByGoodId = async (req, res) => {
    try {
      const { goodId } = req.params;
      const query = `
        SELECT Sale_Id, Date_Sale, Quantity AS Sold_Quantity, Total_Amount
        FROM Sales
        WHERE Good_Id = @GoodId
      `;
  
      const result = await executeQuery(query, [
        { name: "GoodId", type: TYPES.Int, value: goodId },
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No sales found for this product." });
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching sales by good ID:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  
module.exports = {
  getGoods,
  getWorkers,
  getTopSellingGoods,
  getLargestOrder,
  updateGoodsDiscount,
  getSalesByGoodId,
  getGoodById,
};
