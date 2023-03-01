import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  shippedOrder,
  returnOrderConfirmed,
  updateOrderToReturn,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_SHIPPED_RESET,
  ORDER_RETURN_RESET,
  ORDER_UPDATE_RESET,
} from "../constants/orderConstants";
import { savePaymentMethod } from "../actions/cartActions";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { refreshLogin } from "../actions/userActions";
import CheckoutForm from "../components/CheckoutForm"; //stripe checkout form
import getDateString from "../utils/getDateString";

const OrderPage = ({ match, history }) => {
  // load stripe
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const dispatch = useDispatch();
  const orderID = match.params.id;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderShipped = useSelector((state) => state.orderShipped);
  const { loading: loadingShipped, success: successShipped } = orderShipped;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const orderUpdate = useSelector((state) => state.orderUpdate);
  const { loading: loadingUpdate, success: successUpdate } = orderUpdate;

  const orderReturn = useSelector((state) => state.orderReturn);
  const { loading: loadingReturn, success: successReturn } = orderReturn;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: userLoginError } = userDetails;

  // get new access tokens using the refresh token, is user details throws an error
  useEffect(() => {
    if (userLoginError && userInfo) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [userLoginError, dispatch, userInfo]);

  // set order to paid, shipped or delivered, and fetch updated orders
  useEffect(() => {
    if (
      !order ||
      order._id !== orderID ||
      successPay ||
      successDeliver ||
      successShipped ||
      successUpdate ||
      successReturn
    ) {
      if (successPay) dispatch({ type: ORDER_PAY_RESET });
      if (successShipped) dispatch({ type: ORDER_SHIPPED_RESET });
      if (successDeliver) dispatch({ type: ORDER_DELIVER_RESET });
      if (successUpdate) dispatch({ type: ORDER_UPDATE_RESET });
      if (successReturn) dispatch({ type: ORDER_RETURN_RESET });
      dispatch(getOrderDetails(orderID));
    }
  }, [
    order,
    orderID,
    dispatch,
    successPay,
    successDeliver,
    successShipped,
    successUpdate,
    successReturn,
  ]);

  //set order as shipped
  const successShippedHandler = () => {
    dispatch(shippedOrder(orderID));
  };

  // set order as delivered
  const successDeliveryHandler = () => {
    dispatch(deliverOrder(orderID));
  };

  //set order as returned
  const successReturnHandler = () => {
    dispatch(returnOrderConfirmed(orderID));
  };

  // for image input, use a ref
  const inputFile = useRef(null);
  const inputVideo = useRef(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // submit file to uploads, get the url
  const handleFileUpload = async (e) => {
    setImageUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImageUploading(false);
      setImage(data.secure_url);
    } catch (error) {
      console.error(error);
    }
  };

  //submit video upload
  const handleVideoUpload = async (e) => {
    setVideoUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setVideoUploading(false);
      setVideo(data.secure_url);
    } catch (error) {
      console.error(error);
    }
  };

  // dispatch the payment action with the image url
  const handlePayment = async (e) => {
    e.preventDefault();
    if (image) {
      dispatch(payOrder(orderID, { paymentMode: "Online", image }));
    } else {
      alert("Please upload a proof of payment");
    }
  };

  //return request
  const handleReturnRequest = async (e) => {
    e.preventDefault();
    if (video) {
      dispatch(updateOrderToReturn(orderID, { video }));
    } else {
      alert("Please upload a proof of return");
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" duration={10}>
      {error}
    </Message>
  ) : (
    <>
      <h2>Order {orderID}</h2>
      <Row>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong>
                    {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Phone-No: </strong>
                    {order.shippingAddress.phone}
                  </p>
                  <p>
                    <strong>Address: </strong> {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}-
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                  <div>
                    {order.isPaid && order.isShipped ? (
                      <Message variant="success">
                        Shipped at: {getDateString(order.shippedAt)}
                      </Message>
                    ) : (
                      <Message variant="danger">Order Not Shipped Yet</Message>
                    )}
                  </div>
                  {order.isShipped && order.isDelivered && (
                    <div>
                      {order.isDelivered ? (
                        <Message variant="success">
                          Delivered at: {getDateString(order.deliveredAt)}
                        </Message>
                      ) : (
                        <Message variant="danger">
                          Order Not Delivered Yet
                        </Message>
                      )}
                    </div>
                  )}
                    <div>
                    {order.isPaid && order.isShipped && order.isDelivered && order.isReturedRequested && (
                      <Message variant="success">
                        Return Requested at: {getDateString(order.returnRequestedAt)}
                      </Message>)}
                  </div>
                  <div>
                    {order.isPaid && order.isShipped && order.isDelivered && order.isReturedRequested && order.isreturnConfirmed && (
                      <Message variant="success">
                        Return Confirmed at: {getDateString(order.returnConfirmedAt)}
                      </Message>)}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong> {order.paymentMethod}
                  </p>
                  <div>
                    {order.isPaid ? (
                      <>
                        <Message variant="success">
                          Order Confirmed and Paid at:{" "}
                          {getDateString(order.paidAt)}
                        </Message>
                      </>
                    ) : (
                      <Message variant="danger">Not Paid</Message>
                    )}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Cart Items</h2>
                  {order.orderItems.length !== 0 ? (
                    <ListGroup variant="flush">
                      <div
                        style={{
                          background: "red",
                        }}
                      ></div>
                      {order.orderItems.map((item, idx) => (
                        <ListGroup.Item key={idx}>
                          <Row>
                            <Col md={2}>
                              <Image
                                className="product-image"
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x {item.price} ={" "}
                              {(item.qty * item.price).toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                                style: "currency",
                                currency: "INR",
                              })}
                            </Col>
                          </Row>
                          <Row>
                            Size Ordered: {item.size}
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <Message>No order</Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2 className="text-center">Order Summary</h2>
                  </ListGroup.Item>
                  {error && (
                    <ListGroup.Item>
                      <Message variant="danger" duration={10}>
                        {error}
                      </Message>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Subtotal</strong>
                      </Col>
                      <Col>
                        {order.orderItems.map((item, idx) =>
                          (item.qty * item.price).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                          })
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Shipping</strong>
                      </Col>
                      <Col>
                        {order.shippingPrice &&
                          order.shippingPrice.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                          })}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total</strong>
                      </Col>
                      <Col>
                        {order.totalPrice &&
                          order.totalPrice.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                          })}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && order.paymentMethod === "Stripe" && (
                    <>
                      <ListGroup.Item>
                        {loadingPay && <Loader />}
                        <Elements stripe={stripePromise}>
                          <CheckoutForm
                            price={order.totalPrice * 100}
                            orderID={orderID}
                          />
                        </Elements>
                      </ListGroup.Item>
                    </>
                  )}
                  {!order.isPaid && order.paymentMethod !== "Stripe" && (
                    <ListGroup.Item>
                      {imageUploading && <Loader />}
                      {loadingPay && <Loader />}
                      <p>
                        Please Upload Your Payment ScreenShot Here to confirm
                        your order
                      </p>
                      <input
                        accept="image/*"
                        type="file"
                        id="file"
                        ref={inputFile}
                        onChange={handleFileUpload}
                      />
                      <Button
                        type="button"
                        variant="primary"
                        className="mt-2"
                        onClick={handlePayment}
                      >
                        Upload & Confirm Payment
                      </Button>
                    </ListGroup.Item>
                  )}
                  {/* show this post deliver if user wants to return the product */}
                  {order.isPaid &&
                    order.isShipped &&
                    order.isDelivered &&
                    !userInfo.isAdmin &&
                    !order.isReturedRequested && (
                      <ListGroup.Item>
                        {videoUploading && <Loader />}
                        {loadingUpdate && <Loader />}
                        <p>
                          Please Upload Your Product Video to return your order
                        </p>
                        <input
                          type="file"
                          id="file"
                          ref={inputVideo}
                          onChange={handleVideoUpload}
                        />
                        <Button
                          type="button"
                          variant="primary"
                          className="mt-2"
                          onClick={handleReturnRequest}
                        >
                          Upload & Confirm Return
                        </Button>
                      </ListGroup.Item>
                    )}
                  {/* show this only to admins, after payment is done */}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isShipped && (
                      <ListGroup.Item>
                        {loadingShipped && <Loader />}
                        <div className="d-grid">
                          <Button
                            type="button"
                            variant="info"
                            size="md"
                            onClick={successShippedHandler}
                          >
                            Mark as Shipped
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
                  {/* show this only to admins, after payment is done */}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    order.isShipped &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        {loadingDeliver && <Loader />}
                        <div className="d-grid">
                          <Button
                            type="button"
                            variant="info"
                            size="md"
                            onClick={successDeliveryHandler}
                          >
                            Mark as Delivered
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    order.isShipped &&
                    order.isDelivered &&
                    order.isReturedRequested && !order.isreturnConfirmed && (
                      <ListGroup.Item>
                        {loadingReturn && <Loader />}
                        <div className="d-grid">
                          <Button
                            type="button"
                            variant="info"
                            size="md"
                            onClick={successReturnHandler}
                          >
                            Accept Return Request
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default OrderPage;
