import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/footer';
import bannerImage from '../../assets/banner_images/dan-meyers-IQVFVH0ajag-unsplash.jpg';
import card4 from '../../assets/card_images/card4.jpg';
import card5 from '../../assets/card_images/card5.jpg';
import card3 from '../../assets/card_images/card3.png';
import card2 from '../../assets/card_images/card2.jpg';
import card1 from '../../assets/card_images/card1.jpg';
import blog1 from '../../assets/blog_images/blog1.jpg';
import blog2 from '../../assets/blog_images/blog2.jpg';
import blog3 from '../../assets/blog_images/blog3.jpg';

const UserEntry = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

 

  // Inline Styles
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  const agrispotLogoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
  };

  const searchBarStyle = {
    width: '50%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  };

  const buttonStyle = {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const bannerStyle = {
    position: 'relative',
    textAlign: 'center',
    color: 'white',
  };

  const bannerImageStyle = {
    width: '100%',
    height: '50vh',
    objectFit: 'cover',
  };

  const bannerTextStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '36px',
    fontWeight: 'bold',
  };

  const scrollableCardSectionStyle = {
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    padding: '20px',
    marginTop: '20px',
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column', // Vertical stacking of content
    alignItems: 'center',
    width: '250px',
    height: 'auto', // Allow height to adjust dynamically based on content
    maxHeight: '400px', // Set a max height to prevent the card from growing too large
    borderRadius: '8px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
    textAlign: 'center',
    marginRight: '20px',
    padding: '20px',
    wordWrap: 'break-word', // Ensure text stays inside the card
    overflow: 'hidden', // Hide overflow content
  };

  const cardImageStyle = {
    width: '100%',
    borderRadius: '8px 8px 0 0',
    height: '150px',
    objectFit: 'cover',
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px 0',
    lineHeight: '1.2',  // Adjust line height for better readability
    maxHeight: '40px',  // Restrict the height of the title area (adjust as needed)
    overflow: 'hidden',  // Hide any overflow text
    textOverflow: 'ellipsis',  // Show ellipsis for any overflow text
    whiteSpace: 'nowrap',  // Prevent the title from wrapping to the next line
  };
  

  const cardTextStyle = {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px',
    lineHeight: '1.5', // Improve readability
    maxHeight: '100px', // Restrict the height of the text area
    overflow: 'hidden', // Hide overflow text if it's too long
    textOverflow: 'ellipsis', // Add ellipsis to indicate more text
    whiteSpace: 'normal', // Allow normal text wrapping within the container
  };

  // Blog Section Styles
const blogSectionStyle = {
  padding: '40px 20px',
  backgroundColor: '#f9f9f9',
};

const blogTitleStyle = {
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '40px',
};

const blogGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
};

const blogCardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
};

const blogImageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const blogContentStyle = {
  padding: '20px',
};

const blogTitleTextStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '10px 0',
};

const blogTextStyle = {
  fontSize: '14px',
  color: '#666',
  lineHeight: '1.5',
};

  return (
    <div>
      {/* Header Section */}
      <header style={headerStyle}>
        <div className="header-left">
          <h1 style={agrispotLogoStyle}>AGRISPOT</h1>
        </div>
        <div className="header-center">
          <input
            type="text"
            placeholder="Search..."
            style={searchBarStyle}
          />
        </div>
        <div className="header-right">
          <button
            onClick={handleLoginClick}
            style={buttonStyle}
          >
            Log In
          </button>
          <button
            onClick={handleRegisterClick}
            style={buttonStyle}
          >
            Register
          </button>

        </div>
      </header>

      {/* Banner Section */}
      <section style={bannerStyle}>
        <img src={bannerImage} alt="Banner" style={bannerImageStyle} />
        <div style={bannerTextStyle}>
          Welcome to Agrispot - Your Agricultural Hub
        </div>
      </section>

      {/* Scrollable Card Section */}
      <section style={scrollableCardSectionStyle}>
        <div style={cardStyle}>
          {/* Card Image */}
          <img src={card5} alt="Farming" style={cardImageStyle} />

          {/* Card Content */}
          <div style={cardTitleStyle}>Discover More</div>
          <div style={cardTextStyle}>
            Join the community of farmers and sellers to explore the latest agricultural trends, news, and market prices. 
          </div>
        </div>

        <div style={cardStyle}>
          {/* Card Image */}
          <img src={card4} alt="Farming" style={cardImageStyle} />

          {/* Card Content */}
          <div style={cardTitleStyle}> New Techniques</div>
          <div style={cardTextStyle}>
            Learn about modern farming methods to improve yield and sustainability.
          </div>
        </div>

        <div style={cardStyle}>
          {/* Card Image */}
          <img src={card3} alt="Farming" style={cardImageStyle} />

          {/* Card Content */}
          <div style={cardTitleStyle}>Market Insights</div>
          <div style={cardTextStyle}>
            Stay informed on the latest market trends and price updates for crops and produce.
          </div>
        </div>

        <div style={cardStyle}>
          {/* Card Image */}
          <img src={card2} alt="Farming" style={cardImageStyle} />

          {/* Card Content */}
          <div style={cardTitleStyle}>Agricultural News</div>
          <div style={cardTextStyle}>
            Stay up-to-date with the latest news affecting the agricultural sector.
          </div>
        </div>

        <div style={cardStyle}>
          {/* Card Image */}
          <img src={card1} alt="Farming" style={cardImageStyle} />

          {/* Card Content */}
          <div style={cardTitleStyle}>Tech-Driven Solutions</div>
          <div style={cardTextStyle}>
            Discover how technology is revolutionizing agriculture today.
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section style={blogSectionStyle}>
        <h2 style={blogTitleStyle}>Latest Blogs</h2>
        <div style={blogGridStyle}>
          <div style={blogCardStyle}>
            <img src={blog1} alt="Blog 1" style={blogImageStyle} />
            <div style={blogContentStyle}>
              <h3 style={blogTitleTextStyle}>Blog Title 1</h3>
              <p style={blogTextStyle}>
                A brief description of the blog post content goes here...
              </p>
            </div>
          </div>

          <div style={blogCardStyle}>
            <img src={blog2} alt="Blog 2" style={blogImageStyle} />
            <div style={blogContentStyle}>
              <h3 style={blogTitleTextStyle}>Blog Title 2</h3>
              <p style={blogTextStyle}>
                A brief description of the blog post content goes here...
              </p>
            </div>
          </div>

          <div style={blogCardStyle}>
            <img src={blog3} alt="Blog 3" style={blogImageStyle} />
            <div style={blogContentStyle}>
              <h3 style={blogTitleTextStyle}>Blog Title 3</h3>
              <p style={blogTextStyle}>
                A brief description of the blog post content goes here...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserEntry;
