import {
  ADD_REVIEW,
  UPDATE_REVIEW,
  GET_REVIEWS,
  DELETE_REVIEW,
  LOADING,
  PRODUCT_REVIEW_ERROR,
} from "./types";
import axios from "axios";

export const getReviews = (productId) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .get(`https://ural-shop.herokuapp.com/api/review/product/${productId}`)
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: GET_REVIEWS,
        payload: { reviews: data.reviews, average: data.average },
      });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_REVIEW_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const addReview = (rating, text, productId) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .post(
      `https://ural-shop.herokuapp.com/api/review/product/${productId}/review`,
      { rating, text },
      tokenConfig()
    )
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: ADD_REVIEW,
        payload: { review: data.review, average: data.average },
      });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_REVIEW_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const updateReview = (id, rating, text) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .put(`https://ural-shop.herokuapp.com/api/review/${id}`, { rating, text }, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: UPDATE_REVIEW,
        payload: { review: data.updatedReview, average: data.average },
      });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_REVIEW_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const deleteReview = (id) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .delete(`https://ural-shop.herokuapp.com/api/review/${id}`, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: DELETE_REVIEW, payload: { id, average: data.average } });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_REVIEW_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

const tokenConfig = () => {
  const token = localStorage.getItem("user-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) config.headers["user-token"] = token;
  return config;
};
