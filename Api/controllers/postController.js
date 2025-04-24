//since OpenAi will generate image will give us url for the image and the url of the image will last for only  60 minites, we  will store the name
//of the image in our database and store the imaage and then create a clone of the image and storw in our file system in our local device using the logic below

const axios = require("axios");
const fs = require("sharp");
const path = require("path");
const Post = require("../models/Post");
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");


const generateFileName = ()=>{

};

const createPostWithImagesController_V3 =  async (req, res, next){

};

//this will generate name dynamically for eaach of the files of the post
const generateFileNameMultiple = (userId,allPostsLength)=>{
    const date = new Date().toDateString().replace(/:/g,"-");

    return `${userId}-${allPostsLength}-${date}.png`;
}

const createPostWithImagesController_V2 = async (req, res, next)=>{

    const {userId}= req.params;

    const {prompt, negativePrompt,size,style, imageUrl,revisedPrompt} = req.body;

    const allPosts = await Post.find();
    const allPostsLength = allPosts.length;

    const fileName = generateFileName(userId, allPostsLength);

}

const getPostController =  async (req,res, next)=>{}

const getSinglePostController =  async (req,res, next)=>{}


const getUserPostsController =  async (req,res, next)=>{}

const deletePostController =  async (req,res, next)=>{}

const likePostController =  async (req,res, next)=>{}

const  disLikePostController=  async (req,res, next)=>{}

module.exports = {
    createPostWithImagesController_V2,
    createPostWithImagesController_V3,
    getPostController,
    getSinglePostController,
    getUserPostsController,
    deletePostController,
    likePostController,
    disLikePostController,

}




