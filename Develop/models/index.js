// Import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id', // Foreign key in Product table
  onDelete: 'CASCADE', // Optional: Automatically delete products if the category is deleted
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id', // Foreign key in Product table
  onDelete: 'CASCADE', // Optional: Automatically delete products if the category is deleted
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag, // Junction table for the many-to-many relationship
  foreignKey: 'product_id', // Foreign key in ProductTag table
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag, // Junction table for the many-to-many relationship
  foreignKey: 'tag_id', // Foreign key in ProductTag table
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
