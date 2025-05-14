//since OpenAi will generate image will give us url for the image and the url of the image will last for only  60 minites, we  will store the name
//of the image in our database and store the imaage and then create a clone of the image and storw in our file system in our local device using the logic below

const axios = require("axios");
const fs = require("sharp");
const path = require("path");
const Post = require("../models/Post");
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");
const { default: OpenAI } = require("openai");

const generateFileName = (userId, allPostsLength) => {
  const date = new Date().toDateString().replace(/:/g, "-"); //global flag in replacement

  return `${userId}-${allPostsLength}-${date}.png`;
};

//this will generate name dynamically for eaach of the files of the post
const generateFileNameMultiple = (userId, index) => {
  const date = new Date().toDateString().replace(/:/g, "-"); //global flag in replacement

  return `${userId}-${index}-${date}.png`;
};
const createPostWithImagesController_V2 = async (req, res, next) => {
  const { userId } = req.params;

  const { prompt, negativePrompt, size, n, imageUrls } = req.body;
  try {
    const user = User.findById(userId);

    if (!user) {
      throw new CustomError("User not found");
    }

    //version 2 genrates multiple images so we have to map through them and then save in our file system

    const downloadAndConvertImages = await Promise.all(
      imageUrls.map(async (imageUrl, index) => {
        const fileName = generateFileNameMultiple(userId, index);
        const filePath = path.join(__dirname, "../..", "uploads", fileName);

        const response = await axios({
          url: imageUrl,
          responseType: "arraybuffer",
          maxRedirects: 5,
        });

        const imageBuffer = Buffer.from(response.data);

        await sharp(imageBuffer).png().toFile(filePath);

        return fileName;
      })
    );

    //storing in our database

    const newPost = new Post({
      user: userId,
      aiModel: "Ai Image Art Dall-e-v2",
      prompt: prompt,
      negativePrompt: negativePrompt,
      revisedPrompt: "Not available in Ai Image Art Dall-e-v2",
      size: 1,
      quality: "Normal",
      quantity: n,
      style: "Normal",
      images: downloadAndConvertImages,
      aiImage: imageUrls,
    });

    await newPost.save();

    user.posts.push(newPost._id);

    await user.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    next(error);
  }
};

const createPostWithImagesController_V3 = async (req, res, next) => {
  const { userId } = req.params;

  const { prompt, negativePrompt, size, style, imageUrl, revisedPrompt } =
    req.body;

  const allPosts = await Post.find();
  const allPostsLength = allPosts.length;

  const fileName = generateFileName(userId, allPostsLength);

  const filePath = path.join(__dirname, "../..", "uploads", fileName);

  try {
    const user = User.findById(userId);

    if (!user) {
      throw new CustomError("User not found");
    }

    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
      maxRedirects: 5,
    });

    //storing in our database
    const imageBuffer = Buffer.from(response.data);

    await sharp(imageBuffer).png().toFile(filePath);

    const newPost = new Post({
      user: userId,
      aiModel: "Ai Image Art Dall-e-v3",
      prompt: prompt,
      negativePrompt: negativePrompt,
      revisedPrompt: revisedPrompt,
      size: 1,
      quality: "HD",
      style: style,
      images: fileName,
      aiImage: imageUrl,
    });

    await newPost.save();

    user.posts.push(newPost._id);

    await user.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllPostController = async (req, res, next) => {
  try {
    const allPosts = await Post.find();
    // const allPosts = await Post.find().populate({
    //   path: "user",
    //   select: "username ",
    // });

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    next(error);
  }
};

const getSinglePostController = async (req, res, next) => {
  try {
    //destructure the id from the params
    const { postId } = req.params;

    //find the post by id and populate the user field with username
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const returnedPost = await Post.findById(postId).populate({
      path: "user",
      select: "username",
    });
    res.status(200).json({ returnedPost });
  } catch (error) {
    next(error);
  }
};

const getUserPostsController = async (req, res, next) => {
  console.log("req.param from getUserPostController", req.params);

  const { userId } = req.params;

  console.log("userid from getUser Controller", userId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError("User not found");
    }

    // const post = await Post.find({ user: userId }).populate("user", "username");
    const userPosts = await Post.find({ user: userId }).populate({
      path: "user",
      select: "username",
    });

    res.status(200).json({ posts: userPosts });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  const { postId } = req.params;

  try {
    //check if the post to exist in the all posts and finding a particulaarId
    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
      throw new CustomError("Post not found");
    }

    //since any post has a reference to the creator by user:Id
    //we will find the post , then check if it is the user that created ,it and then delete that particular one using filering

    const user = await User.findById(postToDelete.user);

    if (!user) {
      throw new CustomError("Post not found");
    }

    user.posts = user.posts.filter(
      (postId) => postId.toString() !== postToDelete._id
    );

    //after filering  from the user, we can save and then delete the post generally from the Post fields

    await user.save();

    await postToDelete.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const likePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = Post.findById(postId);
    if (!post) {
      throw new CustomError("post not found", 404);
    }

    const user = User.findById(userId);

    if (!user) {
      throw new CustomError("user now found", 404);
    }

    if (post.likes.includes(userId)) {
      throw new CustomError("You have already like this post", 404);
    }

    await Post.likes.push(userId);

    await post.save();

    res.statu(200).json({ message: "Post liked succesfully" });
  } catch (error) {
    next(error);
  }
};

const disLikePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = Post.findById(postId);
    if (!post) {
      throw new CustomError("post not found", 404);
    }

    const user = User.findById(userId);

    if (!user) {
      throw new CustomError("user now found", 404);
    }

    if (post.likes.includes(userId)) {
      throw new CustomError("You have already like this post", 404);
    }

    post.likes = post.like.filter((id) => id.toString() !== postId);

    await post.save();

    res.statu(200).json({ message: "Post disliked succesfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPostWithImagesController_V2,
  createPostWithImagesController_V3,
  getSinglePostController,
  getUserPostsController,
  deletePostController,
  likePostController,
  disLikePostController,
  getAllPostController,
};
