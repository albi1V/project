import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './frl.module.css'; // Import the styles as CSS module

const FarmerProfile = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true);   // Loading state
  const [error, setError] = useState('');         // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email'); // Get the email stored during login

      if (!token || !email) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        });
        
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  const handleCardClick = (cardName) => {
    console.log(`${cardName} card clicked!`);
    // Add your logic here, e.g., navigating to a different page or displaying a modal
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div>
      <header style={{
      backgroundColor: '#2f8f2f', // Green background
      padding: '1rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }}>

      {/* Logo */}
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>AGRISPOT</a>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}>
          <li style={{ marginLeft: '1.5rem' }}>
            <a href="/about" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>About Us</a>
          </li>
          
        </ul>

        {/* User Profile Section */}
        <div style={{ marginLeft: '2rem', display: 'flex', alignItems: 'center' }}>
          {/* User Avatar or Icon */}
          <img 
            src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000"  // Placeholder for user avatar
            alt="User Profile" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '1rem',
              cursor: 'pointer'
            }}
          />
          {/* Dropdown Menu (simplified for now) */}
          <div>
          <select
          
            style={{
    backgroundColor: '#2f8f2f',
    color: 'white',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
  }}>
  <option value="editProfile">Edit Profile</option>
  <option value="profile">Profile (Coming Soon)</option>
  <option value="logout">Logout (Coming Soon)</option>
</select>

          </div>
        </div>
      </nav>
    </header>
{/* Banner Section */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.title}>Welcome, {userData.username}!</h1>
          <p className={styles.message}>
            We're glad to have you here. Explore the platform to manage your crops and connect with buyers.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className={styles.cardSection}>
  <div className={styles.card} onClick={() => handleCardClick('Card 1')}>
    <img src="path/to/image1.jpg" alt="Add Post" className={styles.cardImage} />
    <h2>ADD POST</h2>
    
  </div>
  <div className={styles.card} onClick={() => handleCardClick('Card 2')}>
    <img src="path/to/image2.jpg" alt="Check Products" className={styles.cardImage} />
    <h2>CHECK PRODUCTS</h2>
    
  </div>
  <div className={styles.card} onClick={() => handleCardClick('Card 3')}>
    <img src="path/to/image3.jpg" alt="Whats New" className={styles.cardImage} />
    <h2>WHATS NEW</h2>
   
  </div>
  <div className={styles.card} onClick={() => handleCardClick('Card 4')}>
    <img src="path/to/image4.jpg" alt="Manage Waste" className={styles.cardImage} />
    <h2>MANAGE WASTE</h2>
    
  </div>
</section>

<section className={styles.blogSection}>
  <h2 className={styles.blogTitle}>Latest Blogs</h2>
  <div className={styles.blogList}>
    <div className={styles.blogCard} onClick={() => handleBlogClick('Blog 1')}>
      <img src="path/to/blog-image1.jpg" alt="Blog 1" className={styles.blogImage} />
      <h3>How to Improve Crop Yield</h3>
      <p>Discover top tips for increasing your farm’s crop yield.</p>
    </div>
    <div className={styles.blogCard} onClick={() => handleBlogClick('Blog 2')}>
      <img src="path/to/blog-image2.jpg" alt="Blog 2" className={styles.blogImage} />
      <h3>Organic Farming Techniques</h3>
      <p>Learn the basics of organic farming and sustainable practices.</p>
    </div>
    <div className={styles.blogCard} onClick={() => handleBlogClick('Blog 3')}>
      <img src="path/to/blog-image3.jpg" alt="Blog 3" className={styles.blogImage} />
      <h3>Latest Trends in Agriculture</h3>
      <p>Explore the new technologies shaping the future of agriculture.</p>
    </div>
  </div>
</section>
<section className={styles.productsSection}>
  <h2 className={styles.productsTitle}>Latest Products</h2>
  
  <div className={styles.productsContainer}>
    <div className={styles.productCard}>
      <img src="path/to/product1.jpg" alt="Product 1" className={styles.productImage} />
      <h3>Product 1</h3>
      <p>Description of Product 1</p>
    </div>
    <div className={styles.productCard}>
      <img src="path/to/product2.jpg" alt="Product 2" className={styles.productImage} />
      <h3>Product 2</h3>
      <p>Description of Product 2</p>
    </div>
    <div className={styles.productCard}>
      <img src="path/to/product3.jpg" alt="Product 3" className={styles.productImage} />
      <h3>Product 3</h3>
      <p>Description of Product 3</p>
    </div>
    <div className={styles.productCard}>
      <img src="path/to/product4.jpg" alt="Product 4" className={styles.productImage} />
      <h3>Product 4</h3>
      <p>Description of Product 4</p>
    </div>
  </div>
</section>



    </div>
  );
};

export default FarmerProfile;
