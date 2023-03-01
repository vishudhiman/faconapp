import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { refreshLogin } from "../actions/userActions";
import { listAllOrders } from "../actions/orderActions";
import getDateString from "../utils/getDateString";


const ProductListPage = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1; // to fetch various pages of orders
  const dispatch = useDispatch();
  const orderListAll = useSelector((state) => state.orderListAll); // to avoid blank screen display
  const { loading, orders, error, page, pages, total } = orderListAll;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: userLoginError } = userDetails;

  // refresh access tokens aif user details are failed
  useEffect(() => {
    if (userLoginError && userInfo ) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [userLoginError, dispatch, userInfo]);

  // get all orders by pagenumber
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) dispatch(listAllOrders(pageNumber));
    else history.push("/login");
  }, [dispatch, history, userInfo, pageNumber]);

  const[downloadUrl, setDownloadUrl] = useState(null);

  const downloadImage = (url) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        var element = document.createElement("a");
        element.href = URL.createObjectURL(blob);
        var fileExtension = url.split(".").pop();
        element.download = `payment-verification.${fileExtension}`;
        document.body.appendChild(element);
        element.click();
      });
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>All Orders ({`${total || 0}`})</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message  variant="danger" duration={10}>
          {error}
        </Message>
      ) : (
        <Table striped bordered responsive className="table-sm text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>TOTAL</th>
              <th>DATE</th>
              <th>PAID</th>
              <th>Payment Verification</th>
              <th>SHIPPED</th>
              <th>DELIVERED</th>
              <th>Return Requested</th>
              <th>Return Verification</th>
              <th>Return Confirmed</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order) => {
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>
                      {order.totalPrice.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td>{getDateString(order.createdAt)}</td>
                    <td>
                      {order.isPaid ? (
                        getDateString(order.paidAt)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{
                            color: "red",
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {order.paymentResult && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyItems: "center",
                            gap: "10px",
                            cursor:"pointer" 
                          }}
                        >
                          <img
                            src={order.paymentResult.imageUrl}
                            alt="payment-verified"
                            style={{ width: "50px" }}
                          />
                            <i className="fa fa-download" onClick={()=> downloadImage(order.paymentResult.imageUrl)} />
                        </span>
                      )}
                    </td>
                    <td>
                      {order.isShipped ? (
                        getDateString(order.shippedAt)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{
                            color: "red",
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        getDateString(order.deliveredAt)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{
                            color: "red",
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {order.isReturedRequested ?(
                        "Yes"
                      ):(
                        "No"
                      )}
                    </td>
                    <td>
                      {order.returnResult && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyItems: "center",
                            gap: "10px",
                            cursor:"pointer" 
                          }}
                        >
                          <img
                            src={order.returnResult.videoUrl}
                            alt="payment-verified"
                            style={{ width: "50px" }}
                          />
                            <i className="fa fa-download" onClick={()=> downloadImage(order.returnResult.videoUrl)} />
                        </span>
                      )}
                    </td>
                    <td>
                      {order.isreturnConfirmed ?(
                        "Yes"
                      ):(
                        "No"
                      )}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                    >
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="link" className="btn-sm">
                          View Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
      <Paginate pages={pages} page={page} isAdmin={true} forOrders={true} />
    </>
  );
};

export default ProductListPage;
