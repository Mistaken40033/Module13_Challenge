const router = require("express").Router();
const { Product, Category } = require("../../models");

// The `/api/products` endpoint

// Get all products including their associated Categories
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a product by its `id` value
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  const { product_name, price, stock, category_id } = req.body;

  if (!product_name || price == null || stock == null || !category_id) {
    return res.status(400).json({ error: "All product details are required" });
  }

  try {
    // Check if the category_id exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ error: "Invalid category_id" });
    }

    const newProduct = await Product.create({
      product_name,
      price,
      stock,
      category_id,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Product.update(
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
      },
      { where: { id: req.params.id } }
    );

    if (updated === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ message: "Product updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });

    if (deleted === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
