require('express-async-errors');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog.js');
const User = require('../models/User');
const config = require('../utils/config');
const blogRouter = require('express').Router();

// router
blogRouter
  .route('/')
  .get(async (req, res) => {
    const blogs = await Blog.find({}).populate('user', 'username name id');
    const blogsJSON = blogs.map((blog) => blog.toJSON());

    res.json(blogsJSON);
  })
  .post(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    if (!req.body.title && !req.body.url) {
      return res.status(400).json({
        error: 'missing required field(s)',
      });
    }

    const blog = new Blog({ ...req.body, user: req.user.id });
    const result = (await blog.save()).toJSON();
    // user.blogs = user.blogs.concat(result.id);
    // await user.save();

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { blogs: result.id },
    });
    res.status(201).json(result);
  });

blogRouter
  .route('/:id')
  .delete(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(400).json({ error: 'blog not found' });
    }
    if (blog.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: 'deleting a blog is only permitted to its owner' });
    }

    await blog.remove();
    res.status(204).end();
  })
  .put(async (req, res) => {
    const result = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(result.toJSON());
  });

module.exports = blogRouter;
