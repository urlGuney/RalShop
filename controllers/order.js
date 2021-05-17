const Order = require("../models/orders");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = catchAsync(async (req, res, next) => {
  const {
    billingAddress,
    deliveryAddress,
    invoiceId,
    paymentIntentId,
    seller,
    Product,
    totalAmount,
    groupId,
  } = req.body;
  const user = req.user;

  if (
    !billingAddress ||
    !deliveryAddress ||
    !invoiceId ||
    !paymentIntentId ||
    !seller ||
    !Product ||
    !totalAmount ||
    !groupId
  ) {
    return next(new expressError("Fill All Fields", 400));
  }

  const orderObject = new Order({
    billingAddress,
    deliveryAddress,
    user: user.id,
    seller,
    Product: {
      product: Product.product,
      color: Product.color,
      quantity: Product.quantity,
    },
    invoiceId,
    paymentIntentId,
    totalAmount,
    groupId,
    status: "waitingConfirmation",
  });
  const createdOrder = await orderObject.save();
  const populatedOrder = await createdOrder.execPopulate(
    "Product.product user seller"
  );
  const paymentIntent = await stripe.paymentIntents.retrieve(
    populatedOrder.paymentIntentId
  );
  res.status(200).json({
    groupId: populatedOrder.groupId,
    order: populatedOrder,
    Payment: paymentIntent,
  });
});

const getOrdersByUser = catchAsync(async (req, res) => {
  let orders = [];
  const getOrders = await Order.find({ user: req.user.id })
    .sort({
      createdAt: "desc",
    })
    .populate("Product.product user seller");
  for (let i = 0; i < getOrders.length; i++) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      getOrders[i].paymentIntentId
    );

    orders.push({
      groupId: getOrders[i].groupId,
      order: getOrders[i],
      Payment: paymentIntent.charges.data[0],
    });
  }

  res.status(200).json(orders);
});

const getOrdersBySeller = catchAsync(async (req, res) => {
  let orders = [];
  const getOrders = await Order.find({ user: req.shop.id })
    .sort({ createdAt: "desc" })
    .populate("Product.product user seller");

  for (let i = 0; i < getOrders.length; i++) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      getOrders[i].paymentIntentId
    );

    orders.push({
      groupId: getOrders[i].groupId,
      order: getOrders[i],
      Payment: paymentIntent.charges.data[0],
    });
  }

  res.status(200).json(orders);
});

const orderCancelRequest = catchAsync(async (req, res, next) => {
  const { id, groupId } = req.body;

  const getOrder = await Order.findOne({
    $and: [{ _id: id }, { user: req.user.id }, { groupId }],
  });

  if (!getOrder) return next(new expressError("Order could not found!", 404));
  if (getOrder.status === "cancelRequest")
    return next(new expressError("Cancel request already sent.", 400));

  getOrder.status = "cancelRequest";
  const saveOrder = await getOrder.save();
  res.status(200).json(saveOrder);
});

const changeOrderStatus = catchAsync(async (req, res, next) => {
  const { id, status } = req.body;

  const getOrder = await Order.findOne({
    $and: [{ _id: id }, { seller: req.shop.id }],
  });

  if (!getOrder) return next(new expressError("Order could not found.", 404));

  getOrder.status = status;
  const saveOrder = await Order.save();
  res.status(200).json(saveOrder);
});

const refundOrder = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const getOrder = await Order.findOne({
    $and: [{ _id: id }, { seller: req.shop.id }, { status: "cancelRequest" }],
  });

  if (!getOrder) return next(new expressError("Order Not Found", 404));

  try {
    await stripe.refunds.create({
      payment_intent: getOrder.paymentIntentId,
    });
  } catch (e) {
    return next(new expressError("Error while refunding.", 400));
  }

  getOrder.status = "cancelled";
  const saveOrder = await getOrder.save();

  res.status(200).json(saveOrder);
});

module.exports = {
  createOrder,
  getOrdersBySeller,
  getOrdersByUser,
  changeOrderStatus,
  orderCancelRequest,
  refundOrder,
};
