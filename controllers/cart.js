const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Cart = require("../models/shoppingCart");
const Product = require("../models/product");

const getCardUnauthorized = catchAsync(async (req, res, next) => {
  const Products = req.body.Products;
  console.log(Products);
  let cart = { items: [] };

  for (let item of Products) {
    const getProduct = await Product.findById(item.product);
    if (getProduct) {
      cart.items.push({ ...item, product: getProduct, quantity: item.qty });
    }
  }

  res.status(200).json(cart);
});

const getCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );
  if (!getCart) return next(new expressError("Cart Not Found.", 404));
  if (getCart.user == req.user.id) return res.json(getCart);
  return next(new expressError("You Are Not Owner Of This Card.", 403));
});

const updateCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart) return next(new expressError("Cart Not Found", 404));
  const { products } = req.body;
  getCart.items = [];

  products.forEach((item) => {
    getCart.items.push({
      product: item.product,
      seller: item.seller,
      color: item.color,
      quantity: item.qty,
      stripeProductId: item.stripeProductId,
      stripePriceId: item.stripePriceId,
      selected: item.selected,
    });
  });
  const savedCart = await getCart.save();
  const returnedCart = await Cart.findById(savedCart._id).populate(
    "items.product"
  );
  res.json(returnedCart);
});

const removeAllCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart) return next(new expressError("Cart Not Found", 404));
  getCart.items = [];
  const saveCart = await getCart.save();
  res.json(saveCart);
});

module.exports = {
  getCard,
  getCardUnauthorized,
  updateCard,
  removeAllCard,
};
