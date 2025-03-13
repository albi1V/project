const axios = require("axios");
const Parser = require("rss-parser");
require("dotenv").config();

const parser = new Parser();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;


const RSS_FEED_URL =
  "https://news.google.com/rss/search?q=agriculture&hl=en-US&gl=US&ceid=US:en";

const getUnsplashImage = async (query) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 1 },
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });

    return response.data.results.length > 0
      ? response.data.results[0].urls.small
      : null;
  } catch (error) {
    //console.error("Error fetching Unsplash image:", error);
    return null;
  }
};

const getNews = async (req, res) => {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    const articles = await Promise.all(
      feed.items.map(async (item) => {
        let image = item.enclosure?.url || null; // Check if RSS provides an image

        if (!image) {
          image = await getUnsplashImage(item.title); // Fetch from Unsplash
        }

        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet || "", // Fallback to empty string if not available
          image,
        };
      })
    );

    res.json({ news: articles });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

module.exports = { getNews };
