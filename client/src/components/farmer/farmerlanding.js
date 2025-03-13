import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./frl.module.css"; // Importing CSS module

import addb from "../../assets/farln/addb.png";
import checkp from "../../assets/farln/checkp.png";
import reqm from "../../assets/farln/reqm.png";
import scheme from "../../assets/farln/scheme.png";
import trend from "../../assets/farln/trend.png";
import viewb from "../../assets/farln/viewb.png";
import waste from "../../assets/farln/waste.png";
import order from "../../assets/farln/order.png";
import plant from "../../assets/farln/plant.png"; 
import news from "../../assets/farln/newspaper.png"; 
import dna from "../../assets/farln/dna.png";



import blog1 from "../../assets/blog_images/blog1.jpg";
import blog2 from "../../assets/blog_images/blog2.jpg";
import blog3 from "../../assets/blog_images/blog3.jpg";

import card1 from "../../assets/card_images/card1.jpg";
import card2 from "../../assets/card_images/card2.jpg";
import card3 from "../../assets/card_images/card3.png";
import card4 from "../../assets/card_images/card4.jpg";
import card5 from "../../assets/card_images/card5.jpg";

const FarmerLanding = () => {
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
          `http://localhost:5000/api/auth/user/${email}`,
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

    if (selectedValue === "editProfile") {
      navigate("/edit-profile"); // Redirect to Edit Profile page
    } else if (selectedValue === "profile") {
      navigate("/profile"); // Redirect to Profile page
    } else if (selectedValue === "cart") {
      navigate("/cart"); // Redirect to Cart page
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
              <option value="cart">Cart</option>
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
        <div className={styles.card} onClick={() => navigate("/add-blog")}>
          <img src={addb} alt="Add Post" className={styles.cardImage} />
          <h2>ADD BLOG</h2>
        </div>
        <div
          className={styles.card}
          onClick={() => navigate("/view-all-products")}
        >
          <img src={checkp} alt="Check Products" className={styles.cardImage} />
          <h2>CHECK PRODUCTS</h2>
        </div>
        <div
          id="viewBlog"
          className={styles.card}
          onClick={() => navigate("/view-all-blogs")}
        >
          <img src={viewb} alt="Check Products" className={styles.cardImage} />
          <h2>VIEW BLOG</h2>
        </div>

        <div
          id="newSchemesCard" // Add a unique id here
          className={styles.card}
          onClick={() => navigate("/FarmerViewSchemes")}
        >
          <img src={scheme} alt="New Schemes" className={styles.cardImage} />
          <h2>NEW SCHEMES</h2>
        </div>

        <div
          className={styles.card}
          onClick={() => navigate("/request-for-waste")}
        >
          <img src={waste} alt="Manage Waste" className={styles.cardImage} />
          <h2>MANAGE WASTE</h2>
        </div>
        <div className={styles.card} onClick={() => navigate("/requestHemade")}>
          <img src={reqm} alt="Request He made" className={styles.cardImage} />
          <h2>REQUEST MADE</h2>
        </div>
        <div
          id="currentTrendCard"
          className={styles.card}
          onClick={() => navigate("/trendview")}
        >
          <img src={trend} alt="Manage Waste" className={styles.cardImage} />
          <h2>CURRENT TREND</h2>
        </div>
        <div
          id="currentTrendCard"
          className={styles.card}
          onClick={() => navigate("/plantLocation")}
        >
          <img src={plant} alt="Manage Waste" className={styles.cardImage} />
          <h2>PLANT</h2>
        </div>
        
        <div
          id="currentTrendCard"
          className={styles.card}
          onClick={() => navigate("/viewnews")}
        >
          <img src={news} alt="Manage Waste" className={styles.cardImage} />
          <h2>NEWS</h2>
        </div>
        <div className={styles.card} onClick={() => navigate("/fmrViewOrder")}>
          <img src={order} alt="orders" className={styles.cardImage} />
          <h2>ORDERS</h2>
        </div>
        <div className={styles.card} onClick={() => navigate("/plantHealth")}>
          <img src={dna} alt="orders" className={styles.cardImage} />
          <h2>HEALTH</h2>
        </div>
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

export default FarmerLanding;
