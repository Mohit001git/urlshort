const express = require('express');
const cors = require('cors'); // ✅ Import cors
const { connectToDatabase } = require('./connect');
const URL = require('./models/url');
const urlRoute = require('./routes/url');

const app = express();
const PORT = 8001;

// ✅ Use CORS
app.use(cors({
  origin: '*' // Change '*' to your frontend origin like 'https://your-frontend.vercel.app' for security in production
}));

app.use(express.json());

connectToDatabase('mongodb://localhost:27017/url-shortner')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use("/url", urlRoute);

// Redirect handler
app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  console.log('➡️ Received GET request for:', shortId);

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      console.log('❌ No match found for:', shortId);
      return res.status(404).json({ error: 'Short URL not found' });
    }

    console.log('✅ Redirecting to:', entry.redirectUrl);
    res.redirect(entry.redirectUrl);
  } catch (err) {
    console.error('🔥 Error in GET:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
