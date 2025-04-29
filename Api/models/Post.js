const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      trim: true,
    },
    negativePrompt: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    quality: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      trim: true,
    },
    style: {
      type: String,
      trim: true,
    },
    aiModel: [
      {
        type: String,
        trim: true,
      },
    ],
    aiImage: [
      {
        type: String,
        required: false,
      },
    ],
    images: [
      {
        type: String,
        required: false,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);
// // Prevent model overwrite in dev mode
// export default mongoose.models?.Post || mongoose.model('Post', postSchema);
module.exports = Post;
