const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// Get all tags including their associated Products
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      attributes: ["id", "tag_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
          through: ProductTag,
          as: 'products'
        },
      ],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a tag by its `id` value
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id },
      attributes: ["id", "tag_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
          through: ProductTag,
          as: 'products'
        },
      ],
    });

    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
    } else {
      res.status(200).json(tag);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new tag
router.post("/", async (req, res) => {
  const { tag_name } = req.body;

  if (!tag_name) {
    return res.status(400).json({ error: "Tag name is required" });
  }

  try {
    const newTag = await Tag.create({ tag_name });
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a tag by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );

    if (updated === 0) {
      res.status(404).json({ error: "Tag not found" });
    } else {
      res.status(200).json({ message: "Tag updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a tag by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (deleted === 0) {
      res.status(404).json({ error: "Tag not found" });
    } else {
      res.status(200).json({ message: "Tag deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
