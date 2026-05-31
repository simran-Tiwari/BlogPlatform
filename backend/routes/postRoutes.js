const express = require("express");

const auth = require("../middlewares/authMidlleware");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);

router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;