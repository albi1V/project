const express = require("express");
const { getNews } = require("../controllers/newsController");

const router = express.Router();

// Route to fetch news articles
router.get("/agri", getNews);

module.exports = router;
