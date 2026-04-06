const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
    getCategories,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const { createProductReview } = require("../controllers/productController");

// Add review route
router.post("/:id/reviews", protect, createProductReview);
router.get("/categories", getCategories);

// GET all + CREATE
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, createProduct);

// GET one + UPDATE + DELETE
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);



module.exports = router;