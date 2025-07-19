const { nanoid } = require('nanoid');
const URL = require('../models/url');

async function generateNewShortUrl(req,res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }


    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: [],
    });
    return res.json({
        shortId: shortId,});
}


// async function getAnalytics(req, res) {
//     const shortId = req.params.shortId;
//     const result = await URL.findOne({ shortId });
//     return res.json({ totalclicks: result.visitHistory.length, analytics: result.visitHistory });

// }


async function getAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}



module.exports = {
    generateNewShortUrl,
    getAnalytics,
};