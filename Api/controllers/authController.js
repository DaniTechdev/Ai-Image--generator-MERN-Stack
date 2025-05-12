const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CustomError, erroHandler } = require("../middlewares/error");

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

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      email: email,
    });

    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    //if anything goes wrong, it will push us to error handling middleware we built
    next(error);
  }
};

const loginController = async (req, res, next) => {
  console.log("login controller user", req.body);

  try {
    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new CustomError("User not found!", 404);
      }
      // console.log("user on controller inside", user);
    } else {
      user = await User.findOne({ username: req.body.username });
      if (!user) {
        throw new CustomError("User not found!", 404);
        throw new CustomError("Username or email already exists", 400);
      }
      // console.log("user on controller inside", user);
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw new CustomError("Wrong Credentials!", 401);
    }

    //lets destructure the user document and return user data excludimg the password throw token
    const { password, ...data } = user._doc;

    // const token = jwt.sign({ _id: user._id }, process.env.JWT_EXPIRE);
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET, // ← This must match your verification secret
      { expiresIn: process.env.JWT_EXPIRE } // Use expire for token lifetime
    );

    // res.cookie("token", token.status(200).json(data));

    // console.log("token from server login", token);
    // console.log("data from server login", data);

    res.cookie("token", token).status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  //logout can only happen when we remove the coockies from the user browser
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .json("User logged out successfully");
  } catch (error) {
    next(error);
  }
};

const refetchController = async (req, res, next) => {
  //note the browser will  automatically send the token in the cookie through request,
  //  so we need to get it from the cookie
  //like this
  //const token = jwt.sign({ _id: user._id }, process.env.JWT_EXPIRE);

  const token = req.cookies.token;

  // console.log("Current JWT_SECRET:", process.env.JWT_SECRET);
  // console.log("Current JWT_EXPIRE:", process.env.JWT_EXPIRE);

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
    if (err) {
      throw new CustomError(err, 404);
    }
    try {
      //data is coming from the process token from the gotten frm the browswer req
      //.cookie.token and when we set the token, we actuallyn saved the userId(_id)
      //in the object we passed in

      const id = data._id;
      const user = await User.findOne({ _id: id });

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  });
};

// const refetchController = async (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "No token provided" });
//   }

//   try {
//     const decoded = await new Promise((resolve, reject) => {
//       jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//           console.error("JWT Verification Error:", err.name, err.message);
//           reject(err);
//         } else {
//           resolve(decoded);
//         }
//       });
//     });

//     const user = await User.findById(decoded._id).select("-password");
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     return res.status(200).json({ success: true, user });
//   } catch (err) {
//     console.error("Refetch Error:", err);

//     let status = 500;
//     let message = "Authentication failed";

//     if (err.name === "TokenExpiredError") {
//       status = 403;
//       message = "Token expired";
//     } else if (err.name === "JsonWebTokenError") {
//       status = 401;
//       message = "Invalid token";
//     }

//     return res.status(status).json({ success: false, message });
//   }
// };

module.exports = {
  registerController,
  loginController,
  logoutController,
  refetchController,
};
