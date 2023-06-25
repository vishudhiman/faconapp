import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPay = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { paymentMode, image } = req.body;
    if (paymentMode === "stripe") {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        type: "stripe",
        id: req.body.id,
        imageUrl: image ? image.toString() : null,
        status: req.body.status,
        email_address: req.body.receipt_email,
      };
    } else {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        type: "UPI/Netbanking",
        id: req.body.id,
        imageUrl: image.toString(),
        status: req.body.status,
        email_address: req.body.email,
      };
      const updatedOrder = await order.save();
      //decrease the countInStock of each product purchase
      const products = await Product.find({ _id: { $in: order.orderItems } });
      products.forEach(async (product) => {
        const productToUpdate = await Product.findById(product._id);
        productToUpdate.countInStock -= product.qty;
        await productToUpdate.save();
      });

      res.json(updatedOrder);
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to Confirmed
// @route   GET /api/orders/:id/confirmed
// @access  Private/Admin
const updateOrderToConfirm = asyncHandler(async (req, res) => {
  const { trackingID } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isConfirmed = true;
    order.confirmedAt = Date.now();
    order.trackingID = trackingID;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to NotConfirmed
// @route   GET /api/orders/:id/notConfirmed
// @access  Private/Admin
const updateOrderToNotConfirm = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isConfirmed = false;
    order.reason = reason;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to Shipped
// @route   GET /api/orders/:id/shipped
// @access  Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isShipped = true;
    order.shippedAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDeliver = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get order by ID
// @route   PUT /api/orders/:id/return
// @access  Private
const updateOrderToReturn = asyncHandler(async (req, res) => {
  const { video } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isReturedRequested = true;
    order.returnRequestedAt = Date.now();
    order.returnResult = {
      type: "UPI/Netbanking",
      id: req.body.id,
      videoUrl: video.toString(),
      status: req.body.status,
      email_address: req.body.email,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to return confirmed
// @route   GET /api/orders/:id/returnConfirmed
// @access  Private/Admin
const returnConfirmed = asyncHandler(async (req, res) => {
  const { returnAddress } = req.body;
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isreturnConfirmed = true;
    order.returnConfirmedAt = Date.now();
    order.returnAddress = returnAddress;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // sort orders in descending order of the date they were created at, hence negetive sign
  const allOrders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json(allOrders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1; // the current page number in the pagination
  const pageSize = 20; // total number of entries on a single page

  const count = await Order.countDocuments({}); // total number of documents available

  // find all orders that need to be sent for the current page, by skipping the documents included in the previous pages
  // and limiting the number of documents included in this request
  // sort this in desc order that the document was created at
  const orders = await Order.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "id name")
    .sort("-createdAt");

  // send the list of orders, current page number, total number of pages available
  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC
const stripePayment = asyncHandler(async (req, res) => {
  const { price, email } = req.body;

  // Need to create a payment intent according to stripe docs
  // https://stripe.com/docs/api/payment_intents
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "inr",
    receipt_email: email,
    payment_method_types: ["card"],
  });

  // send this payment intent to the client side
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// @desc  create payment intent for paytm payment
// @route POST /api/orders/paytm-payment
// @access PUBLIC
const paytmPayment = asyncHandler(async (req, res) => {
  const { price, email } = req.body;
  const paytmParams = {};
  paytmParams.body = {
    requestType: "Payment",
    mid: process.env.PAYTM_MID,
    websiteName: process.env.PAYTM_WEBSITE,
    orderId: "ORDERID_98765",
    callbackUrl:
      "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=ORDERID_98765",
    txnAmount: {
      value: price,
      currency: "INR",
    },
    userInfo: {
      custId: "CUST_001",
      emaik: email,
    },
  };
  const checksum = PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    process.env.PAYTM_MERCHANT_KEY
  );
  paytmParams.head = {
    signature: checksum,
  };
  const post_data = JSON.stringify(paytmParams);
  const options = {
    /* for Staging */
    hostname: "securegw-stage.paytm.in",
    /* for Production */
    // hostname: 'securegw.paytm.in',
    port: 443,
    path:
      "/theia/api/v1/initiateTransaction?mid=" +
      process.env.PAYTM_MID +
      "&orderId=" +
      paytmParams.body.orderId,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": post_data.length,
    },
  };
  const response = await new Promise((resolve, reject) => {
    const post_req = https.request(options, function (post_res) {
      post_res.on("data", function (chunk) {
        resolve(JSON.parse(chunk));
      });
    });
    post_req.write(post_data);
    post_req.end();
  });
  res.send(response);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPay,
  updateOrderToShipped,
  updateOrderToDeliver,
  getMyOrders,
  getAllOrders,
  stripePayment,
  paytmPayment,
  updateOrderToReturn,
  returnConfirmed,
  updateOrderToConfirm,
  updateOrderToNotConfirm,
};
