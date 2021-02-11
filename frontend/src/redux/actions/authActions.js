import {
  GET_USER,
  USER_LOGIN,
  REGISTER_USER,
  LOGOUT_USER,
  LOADING,
  AUTH_ERROR,
  GET_USER_BY_USERNAME,
  SEND_FORGOT_PASSWORD_EMAIL,
  SEND_FORGOT_PASSWORD_EMAIL_ERROR,
  CANCEL_FORGOT_PASSWORD,
  CONFIRMATION_CODE_ERROR,
  CONFIRMATION_CODE_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_ERROR,
  UPDATE_USER_DATA,
  USER_ADD_PROFILE_PHOTO,
  REMOVE_PROFILE_PHOTO,
} from "./types";
import axios from "axios";

export const getUser = () => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .get("/api/user/current", tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_USER, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const userLogin = (loginData) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post("/api/user/login", loginData)
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: USER_LOGIN, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const registerUser = (registerData) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post("/api/user/register", registerData)
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: REGISTER_USER, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: LOGOUT_USER });
};

export const getProfile = (username) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .get(`/api/user/p/${username}`)
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_USER_BY_USERNAME, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const sendForgotPasswordEmail = (emailOrUsername) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .post("/api/user/sendEmail", { emailOrUsername })
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: SEND_FORGOT_PASSWORD_EMAIL,
        payload: { emailOrUsername },
      });
    })
    .catch((err) => {
      dispatch({ type: SEND_FORGOT_PASSWORD_EMAIL_ERROR });
    });
};

export const cancelForgotPassword = () => {
  return { type: CANCEL_FORGOT_PASSWORD };
};

export const confirmPasswordResetCode = (resetCode, isImportant = false) => (
  dispatch
) => {
  dispatch({ type: LOADING });
  axios
    .post(`/api/user/checkPasswordResetCode`, {
      usernameOrEmail: localStorage.getItem("emailOrUsername"),
      userToken: resetCode,
    })
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: CONFIRMATION_CODE_SUCCESS,
        payload: { confirmationCode: resetCode },
      });
    })
    .catch((err) => {
      if (isImportant) {
        return dispatch({ type: CANCEL_FORGOT_PASSWORD });
      }
      dispatch({ type: CONFIRMATION_CODE_ERROR });
    });
};

export const changePassword = (
  emailOrUsername,
  confirmationCode,
  newPassword,
  confirmPassword
) => (dispatch) => {
  axios
    .post(
      "/api/user/newPassword",
      { emailOrUsername, newPassword, confirmPassword },
      { headers: { "password-token": confirmationCode } }
    )
    .then(() => {
      dispatch({ type: CHANGE_PASSWORD });
    })
    .catch((err) => dispatch({ type: CHANGE_PASSWORD_ERROR }));
};

export const updateUserData = ({ username, data }) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .put("/api/user/update", { username, data }, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: UPDATE_USER_DATA, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const addProfilePhoto = (formData) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .put("/api/user/updatePhoto", formData, {
      headers: {
        "user-token": localStorage.getItem("user-token"),
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: USER_ADD_PROFILE_PHOTO, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const removeProfilePhoto = () => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .delete("/api/user/profilePhoto", tokenConfig())
    .then((res) => res.data)
    .then((data) => dispatch({ type: REMOVE_PROFILE_PHOTO, payload: data }))
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const loading = () => (dispatch) => {
  dispatch({ type: LOADING });
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
