require('express-async-errors');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter
  .route('/')
  .post(async (req, res) => {
    const body = req.body;

    if (!req.body.username || !req.body.password) {
      return res.status(400).send({
        error: 'missing required field(s)',
      });
    } else if (req.body.password.length < 3) {
      return res
        .status(400)
        .send({ error: 'password must have length at least 3' });
    }

    const saltRounds = 10;
    const password = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name || body.username,
      password,
    });

    const savedUser = await user.save();

    res.json({ ...savedUser.toJSON(), blogs: undefined });
  })
  .get(async (req, res) => {
    const users = await User.find({}).populate('blogs');
    const usersObj = users.map((u) => u.toJSON());
    res.json(usersObj);
  });

module.exports = usersRouter;
