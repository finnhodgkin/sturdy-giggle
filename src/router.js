// destructure the exported functions in handler.js so they can be accessed
// directly by name
const { handleFile, createPost, fetchPosts } = require('./handler');

const router = (req, res) => {
  // get the url except for '/' which should be replaced by 'index.html'
  const url = req.url === '/' ? '/index.html' : req.url;

  if (url === '/create/post') {
    createPost(req, res);
  } else if (url === '/posts') {
    fetchPosts(res);
  } else {
    handleFile(res, url);
  }
};

module.exports = router;
