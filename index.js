// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// const app = express();

// const next = require("next");
// dotenv.config({ path: "./config.env" });
// const coockieParser = require("cookie-parser");
// const dev = process.env.NODE_ENV !== "production";
// const nextServer = next({ dev });
// const handle = nextServer.getRequestHandler();

// const authRoute = require("./Api/routes/auth");
// const userRoute = require("./Api/routes/users");
// const postRoute = require("./Api/routes/posts");

// const path = require("path");

// const { erroHandler } = require("./Api/middlewares/error");
// const verifyToken = require("./Api/middlewares/verifyToken");
// const Post = require("./Api/models/Post");

// const PORT = process.env.PORT || 3000;

// mongoose.connect(process.env.MONGODB_URL).then(() => {
//   console.log("Db connected succesfully");
//   //   console.log("Post.schema.paths", Post.schema);
// });

// app.use(express.json());
// app.use(coockieParser());
// app.use("uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/api/auth", authRoute);
// app.use("/api/post", postRoute);
// app.use("/api/user", verifyToken, userRoute);

// app.use(erroHandler);

// nextServer.prepare().then(() => {
//   app.get("*", (req, res) => {
//     return handle(req, res);
//   });

//   app.listen(PORT, () => {
//     console.log(`App running on port ${PORT}`);
//   });
// });
