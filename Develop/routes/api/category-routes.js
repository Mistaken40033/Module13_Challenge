const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// Get all categories including their associated Products
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "category_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a category by its `id` value
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      attributes: ["id", "category_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json(category);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new category
router.post("/", async (req, res) => {
  if (!req.body.category_name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const newCategory = await Category.create({ category_name: req.body.category_name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a category by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Category.update(
      { category_name: req.body.category_name },
      { where: { id: req.params.id } }
    );

    if (updated === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json({ message: "Category updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { id: req.params.id },
    });

    if (deleted === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json({ message: "Category deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

//   Category.findAll({
//     attributes: ["id", "category_name"],
//     include: [
//       {
//         model: Product,
//         attributes: ["id", "product_name", "price", "stock", "category_id"],
//       },
//     ],
//   })
//     .then((data) => res.status(200).json(data))
//     .catch((err) => res.status(500).json({ error: err.message }));
// });


//   // find one category by its `id` value including its associated Products
//   Category.findOne({
//     where: {
//       id: req.params.id,
//     },
//     attributes: ["id", "category_name"],
//     include: [
//       {
//         model: Product,
//         attributes: ["id", "product_name", "price", "stock", "category_id"],
//       },
//     ],
//   })
  // Category.update(req.body, {
  //   where: {
  //     id: req.params.id,
  //   },
  // })
    // .then((data) => {
    //   if (data[0] === 0) {
    //     res.status(404).json({ error: "Category not found" });
    //   } else {
    //     res.status(200).json({ message: "Category updated successfully" });
    //   }
    // })
//     .catch((err) => res.status(500).json({ error: err.message }));
// });

// delete a category by its `id` value
  // Category.destroy({
  //   where: {
  //     id: req.params.id,
  //   },
  // })
  //   .then((data) => {
  //     if (data === 0) {
  //       res.status(404).json({ error: "Category not found" });
  //     } else {
  //       res.status(200).json({ message: "Category deleted successfully" });
  //     }
  //   })
//     .catch((err) => res.status(500).json({ error: err.message }));
// });