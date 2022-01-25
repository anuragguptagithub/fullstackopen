const Blog = require('../models/blog')
const dummy = (blogs) => {
    return 1
  }
 
 const totalLikes = (blogs) => {
    var likes = 0
    blogs.forEach(blog => {
        likes = likes + blog.likes
    }); 
    return likes
 }
 
 const favouriteBlog = (blogs) => {
    var blog = new Blog()
    blog.likes = 0
    blogs.forEach(b => {
        if (b.likes > blog.likes){
            blog = b
        }
    })
    return blog
 }

 const findTopBlogger = (blogs) => {
    
    const authors = blogs.map(n => n.author)
    var keyCounts = {};
    var topCount = 0;
    var topKey = {};
    authors.forEach( item => {
      keyCounts[item] = keyCounts[item] + 1 || 1;
      if (keyCounts[item] > topCount) {
        topKey = item;
        topCount = keyCounts[item];
      }
    });
  
    return {author: topKey, blogs: topCount};
 }

 const getMostLikes = (blogs) => {
    return blogs.reduce(({sums,most}, {likes, author}) => {
                    sums[author] = likes = (sums[author] || 0) + likes;
                    if (likes > most.likes) 
                        most = {author,likes};
                    return {sums,most};
            }, {sums: {}, most: {likes:0} }).most;
}

  module.exports = {
    dummy, totalLikes, favouriteBlog, findTopBlogger, getMostLikes
  }

