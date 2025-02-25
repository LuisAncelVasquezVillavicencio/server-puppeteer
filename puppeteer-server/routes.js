const express = require('express');
const { renderHandler } = require('./controllers/renderController');
const { robotsHandler, sitemapHandler } = require('./controllers/robotsController');

const router = express.Router();

router.get('/render', renderHandler);
router.get('/sitemap.xml', sitemapHandler);
router.get('/robots.txt', robotsHandler);

module.exports = router;
