const fs = require('fs');
const path = require('path');
const qs = require('querystring');
// Node.js is able to import json files directly (no need for fs.readFile)
const posts = require('./posts.json');

const handleFile = (res, endpoint) => {
  // Get the content type based on the file extension
  const contentType = {
    css: 'text/css',
    html: 'text/html',
    js: 'application/javascript',
    png: 'image/png',
    ico: 'image/x-icon',
  }[endpoint.split('.')[1]];
  // Read and serve the file with the correct MIME type if it exists
  // Otherwise show an error message
  fs.readFile(path.join(__dirname, '..', 'public', endpoint), (err, file) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading content');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(file);
    }
  });
};

const fetchPosts = res => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(posts));
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
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error saving post.');
      } else {
        res.writeHead(301, { Location: '/' });
        res.end();
      }
    });
  });
};

module.exports = {
  handleFile,
  fetchPosts,
  createPost,
};
