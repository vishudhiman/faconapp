import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAILURE,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAILURE,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAILURE,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAILURE,
  ORDER_USER_LIST_REQUEST,
  ORDER_USER_LIST_SUCCESS,
  ORDER_USER_LIST_FAILURE,
  ORDER_ALL_LIST_REQUEST,
  ORDER_ALL_LIST_SUCCESS,
  ORDER_ALL_LIST_FAILURE,
  ORDER_SHIPPED_REQUEST,
  ORDER_SHIPPED_SUCCESS,
  ORDER_SHIPPED_FAILURE,
  ORDER_RETURN_REQUEST,
  ORDER_RETURN_SUCCESS,
  ORDER_RETURN_FAILURE,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_FAILURE,
} from "../constants/orderConstants";

import axios from "axios";

// get all the details about the order and dispatch only of currently logged in
export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.post("/api/orders/", order, config);

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// get details about a particular order
export const getOrderDetails = (orderID) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${userInfo.accessToken}`,
		},
	  };

    const { data } = await axios.get(`/api/orders/${orderID}`, config);

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// update the current order to that of a paid one, and store the correct payment result
export const payOrder =
  (orderID, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_PAY_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${userInfo.accessToken}`,
		},
	  };

      const { data } = await axios.put(
        `/api/orders/${orderID}/pay`,
        paymentResult,
        config
      );
      

      dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  // Set the current order as Shipped, only when logged in user is an admin
export const shippedOrder = (orderID) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_SHIPPED_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
	const config = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${userInfo.accessToken}`,
		},
	  };
    const { data } = await axios.put(
      `/api/orders/${orderID}/ship`,
      {},
      config
    );

    dispatch({ type: ORDER_SHIPPED_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_SHIPPED_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Set the current order as delivered, only when logged in user is an admin
export const deliverOrder = (orderID) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELIVER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
	const config = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${userInfo.accessToken}`,
		},
	  };
    const { data } = await axios.put(
      `/api/orders/${orderID}/deliver`,
      {},
      config
    );

    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// update the order details from the admin panel view
export const updateOrderToReturn = (orderID, returnResult) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.put(
      `/api/orders/${orderID}/return`,
      returnResult,
      config
    );

    dispatch({ type: ORDER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


// Set the current order as Returned, only when logged in user is an admin
export const returnOrderConfirmed = (orderID) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_RETURN_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
	const config = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${userInfo.accessToken}`,
		},
	  };
    const { data } = await axios.put(
      `/api/orders/${orderID}/confirm-return`,
      {},
      config
    );

    dispatch({ type: ORDER_RETURN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_RETURN_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


// list all the orders of a particular user
export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_USER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${userInfo.accessToken}`,
		},
	  };

    const { data } = await axios.get(`/api/orders/myorders`, config);

    dispatch({ type: ORDER_USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_USER_LIST_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// list all orders for the admin panel view, include the pagenumber being fetched
export const listAllOrders =
  (pageNumber = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_ALL_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

	  const config = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${userInfo.accessToken}`,
		},
	  };
      const { data } = await axios.get(
        `/api/orders?pageNumber=${pageNumber}`,
        config
      );

      dispatch({ type: ORDER_ALL_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_ALL_LIST_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
