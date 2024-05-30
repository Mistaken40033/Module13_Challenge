const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// Get all products
router.get("/", (req, res) => {
  Product.findAll({
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    include: [
      {
        model: Category,
        attributes: ["id", "category_name"],
      },
      {
        model: Tag,
        attributes: ["id", "tag_name"],
      },
    ],
  })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Get one product by ID
router.get("/:id", (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    include: [
      {
        model: Category,
        attributes: ["id", "category_name"],
      },
      {
        model: Tag,
        attributes: ["id", "tag_name"],
      },
    ],
  })
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Create new product
router.post("/", (req, res) => {
  if (!req.body.product_name || !req.body.price || !req.body.stock) {
    return res.status(400).json({ error: "Product name, price, and stock are required" });
  }

  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => ({
          product_id: product.id,
          tag_id,
        }));
        return ProductTag.bulkCreate(productTagIdArr).then(() => product);
      }
      res.status(201).json(product);
    })
    .then((product) => res.status(201).json(product))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Update product by ID
router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((rowsUpdated) => {
      if (rowsUpdated[0] === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({
          product_id: req.params.id,
          tag_id,
        }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then(() => res.status(200).json({ message: "Product updated successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Delete product by ID
router.delete("/:id", (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
