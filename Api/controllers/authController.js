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

    const newUser = new User({ ...req.body, password: hashedPassword });

    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    //if anything goes wrong, it will push us to error handling middleware we built
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    let user;
    if (req.body.email) {
      user = User.findOne({ email: req.body.email });
    } else {
      user = User.findOne({ username: req.body.username });
    }

    if (!user) {
      throw new CustomError("user not found", 404);
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw new CustomError("Wrong Credentials!", 401);
    }

    const { password, ...data } = user._doc;

    const token = jwt.sign({ _id: user._id }, process.env.JWT_EXPIRE);

    res.cookie("token", token.status(200).json(data));
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  //logout can only happen when we remove the coockies from the user browser
  try {
  } catch (error) {}
};

const refetchController = async (req, res, next) => {};

module.exports = {
  registerController,
  loginController,
  logoutController,
  refetchController,
};
