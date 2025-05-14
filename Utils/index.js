import React, { useState } from "react";
import OpenAi from "openai";
import axios from "axios";

//getting open endpoint

//THIS UTILS INDEX SERVES ASS OUR CONTEXT API

const openAi = new OpenAi({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true,
});

//we can use the function got format images url in proper ways that v2 can use  generate multiple images
function extratImaageUrls(imageArray) {
  return imageArray.map((image) => image.url);
}

export const REGISTER_USER = async (signUp) => {
  console.log("signup backened", signUp);

  const { name, email, password, confirmPassword } = signUp;

  if (!name || !email || !password || !confirmPassword) {
    return "Data is missing";
  }

  if (password !== confirmPassword) {
    return "Password do not match";
  }

  const response = await axios({
    method: "POST",
    url: "/api/auth/register",
    withCredentials: true,
    data: {
      username: name,
      email: email,
      password: password,
      // confirmPassword: confirmPassword,
    },
  });

  console.log("register response", response);

  if (response.status == 201) {
    window.location.href = "/";
  }
};

export const LOGIN_USER = async (login) => {
  console.log("login backened", login);

  const { email, password } = login;

  if (!email || !password) {
    return "Data is missing";
  }

  const response = await axios({
    method: "POST",
    url: "/api/auth/login",

    withCredentials: true,
    data: {
      email: email,
      password: password,
    },
  });

  if (response.status == 200) {
    console.log("login response from context", response);
    window.location.href = "/";
  }
};

export const LOGOUT = async () => {
  const response = await axios({
    method: "GET",
    url: "/api/auth/logout",
    withCredentials: true,
  });

  if (response.status == 200) {
    window.location.href = "/";
  }
};

export const CHECK_AUTH = async () => {
  const response = await axios({
    method: "GET",
    url: "/api/auth/refetch",

    withCredentials: true,
    // Add timeout to prevent hanging
    timeout: 5000,
    // Explicitly set headers
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // const response = await fetch("/api/auth/refetch", {
  //   method: "GET",
  //   credentials: "include", // Equivalent to withCredentials: true in Axios
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // });

  let user;

  if (response.status == 200) {
    user = response.data;
  }

  return user;
};

export const LIKE_POST = async (postId) => {
  //to get the user information I will use Check_auth function because
  //the user id is in the cooker we sent to the front-end(brower)

  const currentUser = await CHECK_AUTH();

  const userId = currentUser._id;

  const response = await axios({
    method: "POST",
    url: `/api/post/like/${postId}`,
    withCredentials: true,
    data: { userId: userId },
  });

  if (response.status == 200) {
    return response;
  }
};

export const DISLIKE_POST = async (postId) => {
  //to get the user information I will use Check_auth function because
  //the user id is in the cooker we sent to the front-end(brower)

  const currentUser = await CHECK_AUTH();

  const userId = currentUser._id;

  const response = await axios({
    method: "POST",
    url: `/api/post/dislike/${postId}`,
    withCredentials: true,
    data: { userId: userId },
  });

  if (response.status == 200) {
    return response;
  }
};

export const IMAGE_GENERATOR_V3 = async (promptv3) => {
  //to get the user information I will use Check_auth function because
  //the user id is in the cooker we sent to the front-end(brower)

  const currentUser = await CHECK_AUTH();

  const { prompt, negativePrompt, size, style } = promptv3;

  if (!prompt || !negativePrompt || !size || !style) {
    return "Data is missing";
  }

  const LOWERCASE = style.toLowerCase();

  const AIImaage = await OpenAi.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: size,
    quality: "hd",
    n: 1,
    style: LOWERCASE,
  });

  //check if the OpenAai generated the image and then pick the first image in the array and its url and pass to the backened

  if (AIImaage.data[0].url) {
    const response = await axios({
      method: "POST",
      url: `/api/post/create/v3/${currentUser._id}`,
      withCredentials: true,
      data: {
        prompt,
        negativePrompt: negativePrompt,
        revisedPrompt: AIImaage.data[0].revised_prompt,
        size,
        style,
        imageURL: AIImaage.data[0].url,
      },
    });

    //note status 201 is for created and 200 is for success
    if (response.status == 201) {
      const response = await axios({
        method: "POST",
        url: `/api/user/credit/${currentUser._id}`,
        withCredentials: true,
        data: {
          credit: Number(currentUser?.credit) - 1,
        },
      });

      return response;
    }
  }
};

export const IMAGE_GENERATOR_V2 = async (promptv2) => {
  //to get the user information I will use Check_auth function because
  //the user id is in the cooker we sent to the front-end(brower)

  const currentUser = await CHECK_AUTH();

  const { prompt, negativePrompt, size, n } = promptv2;

  if (!prompt || !negativePrompt || !size || !n) {
    return "Data is missing";
  }

  //   const LOWERCASE = style.toLowerCase();

  const AIImaage = await OpenAi.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    size: size,
    n: Number(n),
  });

  const imageUrls = extratImaageUrls(AIImaage.data);

  //check if the OpenAai generated the image and then pick the first image in the array and its url and pass to the backened

  if (imageUrls.length) {
    const response = await axios({
      method: "POST",
      url: `/api/post/create/v2/${currentUser._id}`,
      withCredentials: true,
      data: {
        prompt,
        negativePrompt: negativePrompt,
        size,
        n,
        imageUrls: imageUrls,
      },
    });

    //note status 201 is for created and 200 is for success
    if (response.status == 201) {
      const response = await axios({
        method: "POST",
        url: `/api/user/credit/${currentUser._id}`,
        withCredentials: true,
        data: {
          credit: Number(currentUser?.credit) - 1,
        },
      });

      return response;
    }
  }
};

export const GET_AI_IMAGES = async () => {
  const response = await axios({
    method: "GET",
    url: "/api/post/all",
  });

  if (response.status == 200) {
    return response.data.posts;
  }
};

export const GET_USER_AI_IMAGES = async (userId) => {
  console.log("user id", userId);

  const response = await axios({
    method: "GET",
    url: `/api/post/user/${userId}`,
  });

  if (response.status == 200) {
    return response.data.posts;
  }
};

export const GET_SINGLE_POST = async (postId) => {
  const response = await axios({
    method: "GET",
    url: `/api/post/single/${postId}`,
  });

  if (response.status == 200) {
    return response.data.returnedPost;
  }
};

export const DELETE_POST = async (postId) => {
  const response = await axios({
    method: "DELETE",
    url: `/api/post/delete/${postId}`,
  });

  if (response.status == 200) {
    return response;
  }
};

export const BUYING_CREDIT = async (CREDIT) => {
  const currentUser = await CHECK_AUTH();

  const response = await axios({
    method: "PUT",
    url: `/api/user/credit/${currentUser._id}`,
    withCredentials: true,
    data: {
      credit: Number(currentUser?.credit) + Number(CREDIT),
    },
  });

  if (response.status == 200) {
    return response;
  }
};
