const Router = require("express").Router();
const {
  getCard,
  updateCard,
  removeAllCard,
  getCardUnauthorized,
} = require("../controllers/cart");
const { isUser } = require("../middlewares/isAuth");

Router.post("/check_unauthorized", getCardUnauthorized);
Router.get("/", isUser, getCard);
Router.post("/update", isUser, updateCard);
Router.delete("/remove_all", isUser, removeAllCard);

module.exports = Router;
