'use strict';

const { v4: uuidv4 } = require('uuid');

const bookmarksRouter = require('express').Router();
const bookmarkStore = require('./bookmarkStore');

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarkStore);
  })
  .post((req, res) => {
    const {title, url, content = 'no content', rating = 1} = req.body;

    if(!title) {
      res.status(400).send('Title is required');
      return;
    }

    if(!url) {
      res.status(400).send('URL is required');
      return;
    }

    if(!url.match(/^(http|https):\/\/[^ "]+$/)) {
      res.status(400).send('URL must begin with http:// or https://');
      return;
    }

    const newBookmark = {id: uuidv4(), title, url, content, rating};
    bookmarkStore.push(newBookmark);

    res.status(201).json(newBookmark);
  });

bookmarksRouter
  .route('/:id')
  .get((req, res) => {
    // GET HERE
  })
  .delete((req, res) => {
    // DELETE HERE
  });

module.exports = { bookmarksRouter };

// {
//   "id": "43dj90-hejfije7-34kjil0",
//   "title": "Google.com",
//   "url": "https://www.google.com",
//   "content": "This bookmark goes to google",
//   "rating": "4"
// }