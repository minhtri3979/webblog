const Post = require("../models/post");

const createPost = async (data) => {
  const post = new Post(data);
  return await post.save();
};

module.exports = { createPost };
