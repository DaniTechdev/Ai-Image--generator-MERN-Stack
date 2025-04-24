const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");

const registerController = async (req, res, next) => {
  try {
    const { password, username, email } = req.body;
    const existingUser = await User.findOne({
      $or: [{ username }, { password }],
    });

    //check if username or password has already be used before/regitered before
    if (existingUser) {
      throw new CustomError("Username or email already exists", 400);
    }
    //go ahead and register the user

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hashSync(password, salt);

    c;
  } catch (error) {}
};

const loginController = async (req, res, next) => {};

const logoutController = async (req, res, next) => {};

const refetchController = async (req, res, next) => {};

module.exports = {
  registerController,
  loginController,
  logoutController,
  refetchController,
};
