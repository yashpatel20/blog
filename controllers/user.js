const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users.map(u => u.toJSON()));
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id)
    .populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
      likes: 1
    })
    .populate("comments");
  response.json(user.toJSON());
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    likes: [],
    comments: []
  });
  const savedUser = await user.save();
  const savedUserForToken = {
    username: savedUser.username,
    id: savedUser._id
  };
  const token = jwt.sign(savedUserForToken, process.env.SECRET);
  response.status(200).send({
    token,
    username: savedUser.username,
    name: savedUser.name,
    id: savedUser._id
  });
});

usersRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const likes = body.likes.concat();
});

module.exports = usersRouter;
