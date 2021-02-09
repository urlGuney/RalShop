import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./privateRoutes/privateRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import WishlistPage from "./pages/wishlistPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/actions/authActions";
import PrivateLogin from "./privateRoutes/privateLogin";
import ProfilePage from "./pages/ProfilePage";
import ProfileSettingsPage from "./pages/ProfileSettings";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PasswordCodeConfirmationPage from "./pages/ForgotPasswordCodePage";
import PasswordResetRoute from "./privateRoutes/passwordResetRoutes";

const App = () => {
  const dispatch = useDispatch();
  const User = useSelector((state) => state.Auth);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch, User.isAuthenticated]);

  return (
    <Router>
      <Navbar />
      <div className="container main-container" style={{ paddingTop: "120px" }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateLogin
            path="/auth"
            exact
            component={AuthPage}
            auth={User.isAuthenticated}
          />
          <PrivateLogin
            path="/account/forgot_password"
            exact
            component={ForgotPasswordPage}
            auth={User.isAuthenticated}
          />
          <PrivateRoute
            path="/wishlist"
            exact
            component={WishlistPage}
            auth={User.isAuthenticated}
          />
          <Route path="/user/:username" exact component={ProfilePage} />
          <PrivateRoute
            path="/account/settings"
            exact
            component={ProfileSettingsPage}
            auth={User.isAuthenticated}
          />
          <PasswordResetRoute
            path="/account/forgot_password/confirmation"
            component={PasswordCodeConfirmationPage}
            isPasswordReset={User.forgotPassword.isPasswordReset}
            exact
          />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
