# Blogging Application API

It ia REST api for a blogging application. It can be used to create, like , comment or delete blogs from the database. Made with Node / Express and mongoDB for storing the data. Token based authentication is implemented with JWT.

## Installation

Clone the repo and install all the required dependencies

```bash
git clone https://github.com/yashpatel20/blog.git
cd blog
npm install
```

## Usage

The production api is hosted on https://fierce-shelf-61065.herokuapp.com/api/blogs .

Or run it on the local server with nodemon

```bash
npm run dev
```

## Endpoints

### User

/api/users : GET all users

/api/users/id : GET user with id

/api/users : POST/CREATE a new user

/api/users/id : PUT/UPDATE a user

### Login

/api/login : Login user and send back token

### Blogs

/api/blogs : GET all blogs

/api/blogs/id : GET blog with id

/api/blogs : POST/CREATE new blog

/api/blogs/like/id : PUT/UPDATE like a blog

/api/blogs/unlike/id : PUT/UPDATE unlike a blog

/api/blogs/comment/id : PUT/UPDATE comment on a blog

/api/blogs/id : DELETE blog with id

## Contributing

I am a budding full stack engineer and would greatly appreciate any contributions or issues.
