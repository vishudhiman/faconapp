import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutStatus from "../components/CheckoutStatus";
import { savePaymentMethod } from "../actions/cartActions";
import { refreshLogin, getUserDetails } from "../actions/userActions";

const PaymentPage = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Stripe"); // default option is the stripe one, but users might not understand 'stripe'
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error } = userDetails;

  // fetch user details
  useEffect(() => {
    userInfo && dispatch(getUserDetails("profile"));
  }, [userInfo, dispatch]);

  // refresh the access tokens when user details throws an error
  useEffect(() => {
    if (error && userInfo ) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [error, dispatch, userInfo]);

  // if shipping address is empty, redirect
  useEffect(() => {
    if (!shippingAddress) {
      history.push("/shipping");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      {/* three steps are done in the checkout process */}
      <CheckoutStatus step1 step2 step3 />
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
        }}
      >
        <h1>Payment Method</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Col>
              <Form.Check
                inline
                type="radio"
                label="Stripe(Credit/Debit)"
                id="Stripe"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethod === "Stripe"}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Check
                inline
                type="radio"
                label="Other Payment Methods"
                id="other"
                name="paymentMethod"
                value="Other Payment Methods"
                checked={paymentMethod === "Other Payment Methods"}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <div className="d-grid">
            <Button type="submit" className="my-3" size="md">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </FormContainer>
  );
};

export default PaymentPage;
