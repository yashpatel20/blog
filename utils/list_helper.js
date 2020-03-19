const totalLikes = list => {
  return list.map(blog => blog.likes).reduce((acc, curr) => acc + curr, 0);
};

const favouriteBlog = list => {
  if (list.length == 0) return 0;
  return list.reduce((prev, curr) => (prev.likes > curr.likes ? prev : curr));
};

module.exports = {
  totalLikes,
  favouriteBlog
};
