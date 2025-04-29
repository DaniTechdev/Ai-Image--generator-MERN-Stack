const Post = require("../models/Post");
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");

const getUserController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = User.findById(userId);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    //lets destructure the user data and return user data excludimg the password

    const { password, ...data } = user;

    res.status(200).json(data._doc);
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  const userId = req.body;
  const updateDataa = req.body;

  try {
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      throw new CustomError("User not found", 404);
    }

    //using mongoose method to update the user date

    Object.assign(userToUpdate, updateDataa);

    await userToUpdate.save();

    res
      .status(200)
      .json({ message: "User updated successfully", user: userToUpdate });
  } catch (error) {
    next(error);
  }
};

const buyCredit = async (req, res, next) => {
  const userId = req.body;
  const updateData = req.body;

  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      throw new CustomError("User not found", 404);
    }

    if (updateData.hasOwnProperty("credit")) {
      userToUpdate.credit = updateData.credit;
    }

    userToUpdate.save();

    res
      .status(200)
      .json({ message: "Credit updated successfully", user: userToUpdate });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserController,
  updateUserController,
  buyCredit,
};
