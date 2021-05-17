const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!blogs.length) {
    return 0;
  } else {
    const total = blogs.reduce((acc, cur) => acc + cur.likes, 0);
    // console.log('total :>> ', total);
    return total;
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0];
  }
  const favorite = blogs.reduce((acc, cur) =>
    Math.max(acc.likes, cur.likes) === acc.likes ? acc : cur
  );
  return favorite;
};

const mostBlogs = (blogs) => {
  const group = _.groupBy(blogs, 'author');
  //   console.log('group :>> ', group);
  const keys = Object.keys(group);
  const blogCount = keys.map((key) => {
    return {
      author: key,
      blogs: group[key].length,
    };
  });
  //   console.log('blogCount', blogCount);
  if (blogCount.length === 1) {
    return blogCount[0];
  }
  //   console.log('blogCount :>> ', blogCount);
  const most = blogCount.reduce((acc, cur) =>
    Math.max(acc.blogs, cur.blogs) === acc.blogs ? acc : cur
  );
  return most;
};

const mostLikes = (blogs) => {
  const group = _.groupBy(blogs, 'author');
  //   console.log('group :>> ', group);
  const keys = Object.keys(group);
  const blogCount = keys.map((key) => {
    return {
      author: key,
      likes: group[key].reduce((acc, cur) => acc + cur.likes, 0),
    };
  });
  //   console.log('blogCount', blogCount);
  if (blogCount.length === 1) {
    return blogCount[0];
  }
  //   console.log('blogCount :>> ', blogCount);
  const most = blogCount.reduce((acc, cur) =>
    Math.max(acc.likes, cur.likes) === acc.likes ? acc : cur
  );
  return most;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
