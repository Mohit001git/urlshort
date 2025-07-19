const express = require('express');
const { generateNewShortUrl , getAnalytics } = require('../controllers/url');

const router = express.Router();

router.post ("/", generateNewShortUrl);

router.get('/analytics/:shortId',getAnalytics);
module.exports = router;




