const Blog = require("../models/blog");
const User = require("../models/user");

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const initialBlogs = [
  {
    title: "test blog 1",
    author: "test author 1",
    url: "testblog1.com",
    likes: 10
  },
  {
    title: "test blog 2",
    author: "test author 2",
    url: "testblog2.com",
    likes: 13
  }
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "test blog 10",
    author: "test author 10",
    url: "testblog10.com",
    likes: 13
  });
  await note.save();
  await note.remove();
  return note._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = { initialBlogs, nonExistingId, blogsInDb, usersInDb };
