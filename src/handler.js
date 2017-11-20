const fs = require('fs');
const path = require('path');
const qs = require('querystring');
// Node.js is able to import json files directly (no need for fs.readFile)
const posts = require('./posts.json');

const respondWith = (res, statusCode, contentType, content, headers) => {
  res.writeHead(statusCode, headers || { 'Content-Type': contentType });
  res.end(content);
};

const getContentType = endpoint => {
  // Get the content type based on the file extension
  return {
    css: 'text/css',
    html: 'text/html',
    js: 'application/javascript',
    png: 'image/png',
    ico: 'image/x-icon',
  }[endpoint.split('.')[1]];
};

const handleFile = (res, endpoint) => {
  // Read and serve the file with the correct MIME type if it exists
  // Otherwise show an error message
  fs.readFile(path.join(__dirname, '..', 'public', endpoint), (err, file) => {
    if (err)
      return respondWith(res, 404, 'text/plain', 'Error loading content');
    respondWith(res, 200, getContentType(endpoint), file);
  });
};

const fetchPosts = res => {
  respondWith(res, 200, 'application/json', JSON.stringify(posts));
};

const createPost = (req, res) => {
  let postData = '';
  req.on('data', data => (postData += data));
  req.on('end', () => {
    // parse the post data using the node core querystring module
    const postMessage = qs.parse(postData).post;
    // get the current time to use as a timestamp
    const time = Date.now();
    // add the message to the imported JSON object
    posts[time] = postMessage;
    // turn the JSON object into a string
    const post = JSON.stringify(posts);

    // overwrite the old JSON file with our new JSON string
    fs.writeFile(path.join(__dirname, 'posts.json'), post, (err, file) => {
      if (err) return respondWith(res, 500, 'text/plain', 'Error saving post.');

      respondWith(res, 301, '', '', { Location: '/' });
    });
  });
};

module.exports = {
  handleFile,
  fetchPosts,
  createPost,
};
