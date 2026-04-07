const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const normalizeImagesInput = (images) => {
  if (Array.isArray(images)) {
    return images
      .flatMap((image) =>
        typeof image === "string" ? image.split(/[\r\n,]+/) : []
      )
      .map((image) => image.trim())
      .filter(Boolean);
  }

  if (typeof images === "string") {
    return images
      .split(/[\r\n,]+/)
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
};

exports.getProducts = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const priceFilter =
    req.query.minPrice && req.query.maxPrice
      ? {
          price: {
            $gte: Number(req.query.minPrice),
            $lte: Number(req.query.maxPrice),
          },
        }
      : {};

  const filter = {
    ...keyword,
    ...category,
    ...priceFilter,
  };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    images,
    brand,
    category,
    countInStock,
  } = req.body;

  if (!name || !description || !image || !category) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const normalizedImages = normalizeImagesInput(images);

  const product = new Product({
    name,
    price: Number(price) || 0,
    description,
    image,
    images: normalizedImages,
    brand,
    category,
    countInStock: Number(countInStock) || 0,
    user: req.user._id,
  });

  const createdProduct = await product.save();

  res.status(201).json({
    message: "Product created successfully",
    product: createdProduct,
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const {
    name,
    price,
    description,
    image,
    images,
    brand,
    category,
    countInStock,
  } = req.body;

  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  product.image = image ?? product.image;

  if (Object.prototype.hasOwnProperty.call(req.body, "images")) {
    product.images = normalizeImagesInput(images);
  }

  product.brand = brand ?? product.brand;
  product.category = category ?? product.category;
  product.countInStock = countInStock ?? product.countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

exports.createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((total, item) => total + item.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
});
