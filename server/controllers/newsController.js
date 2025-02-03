const Parser = require("rss-parser");

const parser = new Parser();

// Define Google News RSS Feed URL for Agriculture
const RSS_FEED_URL = "https://news.google.com/rss/search?q=agriculture&hl=en-US&gl=US&ceid=US:en";

// Controller function to fetch news articles
const getNews = async (req, res) => {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    const articles = feed.items.map((item) => {
      // Try to extract image URL from the enclosure, otherwise from the content
      let imageUrl = item.enclosures && item.enclosures.length > 0 ? item.enclosures[0].url : null;
      if (!imageUrl && item.content) {
        // Extract image URL from the content HTML (if no enclosure)
        const imageRegex = /<img[^>]+src="([^">]+)"/;
        const match = item.content.match(imageRegex);
        imageUrl = match ? match[1] : null;
      }

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet,
        image: imageUrl,  // Add image URL to the response
      };
    });

    res.json({ news: articles });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

module.exports = { getNews };
