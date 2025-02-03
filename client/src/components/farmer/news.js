import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./fsidebar";
import Navbar from "./fnavbar";
import styles from "./news.module.css";

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news/agri");
        setNews(response.data.news);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.formContainer}>
          <header className={styles.header}>
            <h1 className={styles.newspaperTitle}>Agriculture Daily</h1>
            <p className={styles.tagline}>Your Daily Source of Agricultural News</p>
          </header>

          <div className={styles.newsGrid}>
            {news.map((article, index) => (
              <div key={index} className={styles.articleCard}>
                <img
                  src={article.image || "https://via.placeholder.com/400"}
                  alt={article.title}
                  className={styles.articleImage}
                />
                <div className={styles.articleContent}>
                  <h2 className={styles.articleTitle}>{article.title}</h2>
                  <p className={styles.articleDate}>{article.pubDate}</p>
                  <p className={styles.articleSnippet}>{article.contentSnippet}</p>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.readMoreLink}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
