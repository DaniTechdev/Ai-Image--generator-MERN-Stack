const express = require("express");

const {
  registerController,
  loginController,
  logoutController,
  refetchController,
} = require("../controllers/authController");

const router = express.Router();

//REGISTER
router.post("/register", registerController);

//LOGIN
router.post("/login", loginController);

//LOGOUT
router.get("/logout", logoutController);

//REFETCH
router.get("/refetch", refetchController);

module.exports = router;
