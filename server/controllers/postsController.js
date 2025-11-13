const { validationResult } = require('express-validator');
const Post = require('../models/Post');

exports.getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') }];
    const posts = await Post.find(filter)
      .populate('author','name email')
      .populate('category','name slug')
      .sort({ createdAt: -1 })
      .skip((page-1) * limit)
      .limit(Number(limit));
    const count = await Post.countDocuments(filter);
    res.json({ success:true, data: posts, meta: { total: count, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

exports.getPost = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    const post = await Post.findOne({ $or: [{ _id: idOrSlug }, { slug: idOrSlug }] })
      .populate('author','name')
      .populate('category','name');
    if (!post) return res.status(404).json({ success:false, error: 'Post not found' });
    await post.incrementViewCount();
    res.json({ success:true, data: post });
  } catch (err) { next(err); }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });
    const data = req.body;
    if (req.file) data.featuredImage = `/uploads/${req.file.filename}`;
    data.author = req.user._id;
    const post = await Post.create(data);
    res.status(201).json({ success:true, data: post });
  } catch (err) { next(err); }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success:false, error: 'Not found' });
    // Only author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success:false, error: 'Forbidden' });
    }
    const updates = req.body;
    if (req.file) updates.featuredImage = `/uploads/${req.file.filename}`;
    Object.assign(post, updates);
    await post.save();
    res.json({ success:true, data: post });
  } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success:false, error: 'Not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success:false, error: 'Forbidden' });
    }
    await post.remove();
    res.json({ success:true, message: 'Post deleted' });
  } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success:false, error: 'Not found' });
    post.comments.push({ user: req.user._id, content: req.body.content });
    await post.save();
    res.status(201).json({ success:true, data: post });
  } catch (err) { next(err); }
};
