'use strict';

const { v4: uuidv4 } = require('uuid');

const bookmarksRouter = require('express').Router();
const bookmarkStore = require('./bookmarkStore');
const logger = require('./logger');

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarkStore);
  })
  .post((req, res) => {
    const {title, url, content = 'no content', rating = 1} = req.body;

    if(!title) {
      logger.info(`Got a status 400 with title of ${title}.`);
      return res.status(400).send('Title is required');
    }

    if(!url) {
      logger.info(`Got a status 400 with url of ${url}`);
      return res.status(400).send('URL is required');
    }

    if(!url.match(/^(http|https):\/\/[^ "]+$/)) {
      logger.info(`Got a status 400 with url of ${url}`);
      return res.status(400).send('URL must begin with http:// or https://');
    }

    const newBookmark = {id: uuidv4(), title, url, content, rating};
    bookmarkStore.push(newBookmark);

    logger.info(`POST completed: ${newBookmark.title} added to store with ${newBookmark.id}.`);

    res.status(201).json(newBookmark);
  });

bookmarksRouter
  .route('/:bookmark_id')
  .get((req, res) => {
    const {bookmark_id} = req.params;
    const bookmark = bookmarkStore.find(bm => bm.id === bookmark_id);

    if(!bookmark) {
      logger.info(`Got a status 404 with bookmark id of ${bookmark_id}`);
      return res
        .status(404)
        .send('404 Not Found');
    }

    res.json(bookmark);

  })
  .delete((req, res) => {
    const {bookmark_id} = req.params;
    const bookmarkIndex = bookmarkStore.findIndex(bm => bm.id === bookmark_id);

    if(bookmarkIndex === -1) {
      logger.info(`Got a status 404 with bookmark id of ${bookmark_id}`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }

    bookmarkStore.splice(bookmarkIndex,1);

    logger.info(`DELETE completed: Bookmark with id of ${bookmark_id} was deleted from store.`);

    res
      .status(204)  
      .send(`Bookmark ${bookmark_id} has been deleted`);

  });

module.exports = { bookmarksRouter };