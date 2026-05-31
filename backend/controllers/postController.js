
const PostModel = require("../models/PostModel");
const createPost = async(req, res)=>{
    const post = await PostModel.create({...req.body, author: req.user.id});
    res.status(201).json({
       message:"Post created successfully",
        post
    });


}

const getPosts = async(req,res)=>{
    const page = Number(req,query.pagr) || 1;
    const limit = Number(req.query.limit) || 10;

    const query = {};

    if(req.query.tag){
        query.tags = req.query.tag;
    }

    const total = await PostModel.countDocuments(query);
    const posts = await PostModel.find(query)
                 .populate("author", "name", "email")
                 .skip((page-1)*limit)
                 .limit(limit);

    res.status(200).json({
       total,
       page,
       pages: Math.ceil(total/limit),
       results : posts
    });
}

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email");

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  res.json(post);
};

const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email");

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  res.json(post);
};

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  const isOwner =
    post.author.toString() === req.user.id;

  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await post.deleteOne();

  res.json({
    message: "Post deleted",
  });
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};