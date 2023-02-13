import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import FormContainer from "../components/FormContainer";
import CheckoutStatus from "../components/CheckoutStatus";
import { saveShippingAddress } from "../actions/cartActions";
import { refreshLogin, getUserDetails } from "../actions/userActions";

const ShippingPage = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error } = userDetails;

  const [phone, setPhone] = useState(shippingAddress.phone);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  // fetch user details from the redux store
  useEffect(() => {
    userInfo && dispatch(getUserDetails("profile"));
  }, [userInfo, dispatch]);

  // update access token to a new ine using the refresh tokens
  useEffect(() => {
    if (error && userInfo) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [error, dispatch, userInfo]);

  useEffect(() => {
    if (!(cartItems.length && userInfo)) {
      history.push("/");
    }
  }, [cartItems, history, userInfo]);

  // save shipping address and move to payment screen
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        phone,
        address,
        city,
        postalCode,
        country,
      })
    );
    history.push("/payment");
  };

  return (
    <FormContainer>
      <CheckoutStatus step1 step2 />
      <h1>Shipping Address</h1>
      <Form onSubmit={handleSubmit}>
      <Form.Group controlId="address">
          <FloatingLabel
            controlId="mobileinput"
            label="Phone"
          >
          </FloatingLabel>
          <Form.Control
              placeholder="Enter Your Mobile No"
              className="mb-2"
              type="text"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="address">
          <FloatingLabel
            controlId="addressinput"
            label="Address"
          >
          </FloatingLabel>
          <Form.Control
              placeholder="Enter address"
              className="mb-2"
              type="text"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="city">
          <FloatingLabel controlId="cityinput" label="City">
          </FloatingLabel>
          <Form.Control
              placeholder="Enter City"
              className="mb-2"
              type="text"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="postalCode">
          <FloatingLabel
            controlId="postalcodeinput"
            label="Postal Code"
          >
          </FloatingLabel>
          <Form.Control
              placeholder="Enter Postal Code"
              className="mb-2"
              type="text"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="country">
          <FloatingLabel
            controlId="countryinput"
            label="Country"
          >
          </FloatingLabel>
          <Form.Control
              placeholder="Enter Country"
              className="mb-2"
              type="text"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
        </Form.Group>
        <div className="d-flex">
          <Button
            type="submit"
            className="ms-auto mt-2"
            style={{
              padding: "0.5em 1em",
              width: "8rem",
            }}
          >
            Continue
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
