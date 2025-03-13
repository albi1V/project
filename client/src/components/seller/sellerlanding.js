import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./slrlan.module.css"; // Importing CSS module

import add from "../../assets/slrfun/add.png";
import checkord from "../../assets/slrfun/checkord.png";
import comp from "../../assets/slrfun/comp.png";
import stati from "../../assets/slrfun/slr_statistics.png"

import blog1 from "../../assets/blog_images/blog1.jpg";
import blog2 from "../../assets/blog_images/blog2.jpg";
import blog3 from "../../assets/blog_images/blog3.jpg";

import card1 from "../../assets/card_images/card1.jpg";
import card2 from "../../assets/card_images/card2.jpg";
import card3 from "../../assets/card_images/card3.png";
import card4 from "../../assets/card_images/card4.jpg";
import card5 from "../../assets/card_images/card5.jpg";

const SellerLanding = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email"); // Get the email stored during login

      if (!token || !email) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://project-9jg7.onrender.com/api/auth/user/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token for authorization
            },
          }
        );

        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleMenuChange = (event) => {
    const selectedValue = event.target.value;

    // Logic to handle navigation based on selected option
    if (selectedValue === "editProfile") {
      navigate("/slr-edit-profile"); // Redirect to Edit Profile page
    } else if (selectedValue === "profile") {
      navigate("/seller-profile"); // Redirect to Profile page
    } else if (selectedValue === "logout") {
      localStorage.removeItem("token"); // Clear the token
      localStorage.removeItem("email"); // Clear the email
      navigate("/login"); // Redirect to Login page (or the landing page)
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.logo}>
          <a href="/">AGRISPOT</a>
        </div>
        <nav>
          <ul className={styles.navLinks}></ul>
          <div className={styles.profile}>
            <img
              src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
              alt="User Profile"
              className={styles.avatar}
            />
            <select className={styles.selectMenu} onChange={handleMenuChange}>
              <option value="">Select</option> {/* Default option */}
              <option value="editProfile">Edit Profile</option>
              <option value="profile">Profile</option>
              <option value="logout">Logout</option>
            </select>
          </div>
        </nav>
      </header>

      {/* Banner Section */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.title}>Welcome, {userData.username}!</h1>
          <p className={styles.message}>
            We're glad to have you here. Explore the platform to manage your
            crops and connect with buyers.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className={styles.cardSection}>
        <div className={styles.card} onClick={() => navigate("/add-products")}>
          <img src={add} alt="Add Post" className={styles.cardImage} />
          <h2>ADD PRODUCT</h2>
        </div>
        
        <div
          id="checkOrdersCard"
          className={styles.card}
          onClick={() => navigate("/slr-view-orderes")}
        >
          <img
            src={checkord}
            alt="Check Products"
            className={styles.cardImage}
          />
          <h2>CHECK ORDERS</h2>
        </div>

        <div
          className={styles.card}
          onClick={() => console.log("Card 3 clicked")}
        >
          <img src={comp} alt="Whats New" className={styles.cardImage} />
          <h2>COMPLINTS</h2>
        </div>

        <div
          className={styles.card}
          onClick={() => navigate("/slr-view-statistics")}
        >
          <img src={stati} alt="Whats New" className={styles.cardImage} />
          <h2>STATISTICS</h2>
        </div>

        {/* <div className={styles.card} onClick={() => console.log('Card 4 clicked')}>
            <img src="path/to/image4.jpg" alt="Manage Waste" className={styles.cardImage} />
            <h2>MANAGE WASTE</h2>
          </div> */}
      </section>

      {/* Blog Section */}
      <section className={styles.blogSection}>
        <h2 className={styles.blogTitle}>Latest Blogs</h2>
        <div className={styles.blogList}>
          <div className={styles.blogCard}>
            <img src={blog1} alt="Blog 1" className={styles.blogImage} />
            <h3>How to Improve Crop Yield</h3>
            <p>Discover top tips for increasing your farm’s crop yield.</p>
          </div>
          <div className={styles.blogCard}>
            <img src={blog2} alt="Blog 2" className={styles.blogImage} />
            <h3>Organic Farming Techniques</h3>
            <p>
              Learn the basics of organic farming and sustainable practices.
            </p>
          </div>
          <div className={styles.blogCard}>
            <img src={blog3} alt="Blog 3" className={styles.blogImage} />
            <h3>Latest Trends in Agriculture</h3>
            <p>
              Explore the new technologies shaping the future of agriculture.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <h2 className={styles.productsTitle}>Latest Products</h2>
        <div className={styles.productsContainer}>
          <div className={styles.productCard}>
            <img src={card1} alt="Product 1" className={styles.productImage} />
            <h3>New seeds availabe</h3>
            <p>Easy to farm seeds are availabe </p>
          </div>

          <div className={styles.productCard}>
            <img src={card3} alt="Product 3" className={styles.productImage} />
            <h3>Weather can predict </h3>
            <p>New technology can help to predict the weather </p>
          </div>
          <div className={styles.productCard}>
            <img src={card4} alt="Product 4" className={styles.productImage} />
            <h3>help of drons </h3>
            <p>Drones help to change the way off farming</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerLanding;
