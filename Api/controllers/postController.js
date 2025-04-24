//since OpenAi will generate image will give us url for the image and the url of the image will last for only  60 minites, we  will store the name
//of the image in our database and store the imaage and then create a clone of the image and storw in our file system in our local device using the logic below

const axios = require("axios");
const fs = require("sharp");
const path = require("path");
const Post = require("../models/Post");
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");

const generateFileName = (userId, allPostsLength) => {
  const date = new Date().toDateString().replace(/:/g, "-"); //global flag in replacement

  return `${userId}-${allPostsLength}-${date}.png`;
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

    const downloadAndConvert = await Promise.all(
      imageUrls.map(async (imageUrl, index) => {
        const fileName = generateFileName(userId, index);
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

//this will generate name dynamically for eaach of the files of the post
const generateFileNameMultiple = (userId, index) => {
  const date = new Date().toDateString().replace(/:/g, "-"); //global flag in replacement

  return `${userId}-${index}-${date}.png`;
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

const getPostController = async (req, res, next) => {};

const getSinglePostController = async (req, res, next) => {};

const getUserPostsController = async (req, res, next) => {};

const deletePostController = async (req, res, next) => {};

const likePostController = async (req, res, next) => {};

const disLikePostController = async (req, res, next) => {};

module.exports = {
  createPostWithImagesController_V2,
  createPostWithImagesController_V3,
  getPostController,
  getSinglePostController,
  getUserPostsController,
  deletePostController,
  likePostController,
  disLikePostController,
};
