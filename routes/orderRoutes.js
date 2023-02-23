import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPay,
  updateOrderToDeliver,
  getMyOrders,
  getAllOrders,
  stripePayment,
  paytmPayment,
  updateOrderToShipped,
} from "../controllers/orderController.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc  create a new order, get all orders
// @route GET /api/orders
// @access PRIVATE && PRIVATE/ADMIN
router
  .route("/")
  .post(protectRoute, addOrderItems)
  .get(protectRoute, isAdmin, getAllOrders);

// @desc  fetch the orders of the user logged in
// @route GET /api/orders/myorders
// @access PRIVATE
router.route("/myorders").get(protectRoute, getMyOrders);

// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC
router.route("/stripe-payment").post(stripePayment);
router.route("/paytm-payment").post(paytmPayment);

// @desc  get an order by id
// @route GET /api/orders/:id
// @access PRIVATE
router.route("/:id").get(protectRoute, getOrderById);

// @desc  update the order object once paid
// @route PUT /api/orders/:id/pay
// @access PRIVATE
router.route("/:id/pay").put(protectRoute, updateOrderToPay);

// @desc  update the order object once Shipped
// @route PUT /api/orders/:id/shipped
// @access PRIVATE/ADMIN
router.route("/:id/ship").put(protectRoute, isAdmin, updateOrderToShipped);

// @desc  update the order object once delivered
// @route PUT /api/orders/:id/pay
// @access PRIVATE/ADMIN
router.route("/:id/deliver").put(protectRoute, isAdmin, updateOrderToDeliver);

export default router;
