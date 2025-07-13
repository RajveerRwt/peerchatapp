const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Create a new post
router.post('/', upload.single('image'), async (req, res) => {
  const { content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newPost = new Post({ content, imageUrl });
  await newPost.save();
  res.json(newPost);
});

// Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Like a post
router.post('/:id/like', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json(post);
});

// Dislike a post
router.post('/:id/dislike', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.dislikes += 1;
  await post.save();
  res.json(post);
});

// Add a comment
router.post('/:id/comment', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ text: req.body.text });
  await post.save();
  res.json(post);
});

module.exports = router;
