const express = require("express");
const userController = require("../Controller/UserController");

const router = express.Router();

router
  .post("/", userController.createProduct)
  .get("/", userController.getAllProducts)
  .get("/:id", userController.getProduct)
  .put("/:id", userController.replaceProduct)
  .patch("/:id", userController.updateProduct)
  .delete("/:id", userController.deleteProduct);

exports.router = router;
