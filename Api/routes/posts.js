const express = require("express");

const {
  createPostWithImagesController_V2,
  createPostWithImagesController_V3,
  getSinglePostController,
  getPostsController,
  getAllPostController,
  deletePostController,
  likePostController,
  disLikePostController,
  getUserPostsController,
} = require("../controllers/postController");

const router = express.Router();

router.post("/create/v3/:userId", createPostWithImagesController_V3);
router.post("/create/v2/:userId", createPostWithImagesController_V2);

router.get("/all", getAllPostController);

router.get("/single/:postId", getSinglePostController);

router.get("/user/:userId", getUserPostsController);

router.delete("/delete/:postId", deletePostController);

router.post("/like/:postId", likePostController);

router.post("/dislike/:postId", disLikePostController);

module.exports = router;
