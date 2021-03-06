import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSellerRoute } from "../redux/actions/sellerActions";

const SellerChangePasswordPage = ({
  component: Component,
  isResetPasswordSuccess,
  ...rest
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(notSellerRoute());
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        isResetPasswordSuccess === true || isResetPasswordSuccess === null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/seller/login" />
        )
      }
    />
  );
};

export default SellerChangePasswordPage;
