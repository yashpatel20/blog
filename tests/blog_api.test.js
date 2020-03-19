//INTEGRATION TESTS

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");

describe("Users", () => {
  describe("when there is initially one user at db", () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "salainen"
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

      const usernames = usersAtEnd.map(u => u.username);
      expect(usernames).toContain(newUser.username);
    });
  });

  describe("when there is initially one user at db", () => {
    // ...

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Superuser",
        password: "salainen"
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result.body.error).toContain("`username` to be unique");

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
  });
});

describe("Blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    const promiseArr = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArr);
  });

  //GET
  describe("GET", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("there are two blogs", async () => {
      const response = await api.get("/api/blogs");
      expect(response.body.length).toBe(helper.initialBlogs.length);
    });

    test("the first blog is about title blog 1", async () => {
      const response = await api.get("/api/blogs");
      const contents = response.body.map(r => r.title);
      expect(contents).toContain("test blog 1");
    });
  });

  //POST
  describe("POST", () => {
    test("a valid Blog can be added", async () => {
      //new blog
      const blog = new Blog({
        title: "test blog 3",
        author: "test author 3",
        url: "testblog3.com",
        likes: 23
      });

      //POST req
      await api
        .post("/api/blogs")
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      //checking if post works
      const blogsInEnd = await helper.blogsInDb();
      expect(blogsInEnd.length).toBe(helper.initialBlogs.length + 1);
      const contents = blogsInEnd.map(blog => blog.title);
      expect(contents).toContain("test blog 3");
    });
  });

  describe("GET ID", () => {
    test("a specific blog can be viewed", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];
      const result = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(result.body).toEqual(blogToView);
    });
  });

  describe("DELETE", () => {
    test("a blog can be deleted", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);
      const contents = blogsAtEnd.map(blog => blog.title);
      expect(contents).not.toContain(blogToDelete);
    });
  });

  describe("PUT", () => {
    test("a blog can be updated", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const blog = new Blog({
        ...blogToUpdate,
        likes: 100
      });
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd[0].likes).toBe(blog.likes);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
