const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  // find all categories including its associated Products
  Category.findAll({
    attributes: ["id", "category_name"],
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value including its associated Products
  Category.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "category_name"],
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: "Category not found" });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/", (req, res) => {
  // create a new category
  if (!req.body.category_name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  Category.create({ category_name: req.body.category_name })
    .then((data) => res.status(201).json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (data[0] === 0) {
        res.status(404).json({ error: "Category not found" });
      } else {
        res.status(200).json({ message: "Category updated successfully" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (data === 0) {
        res.status(404).json({ error: "Category not found" });
      } else {
        res.status(200).json({ message: "Category deleted successfully" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;