import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#2f8f2f',  // Green background
      padding: '1rem',  // Reduced padding to half
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Left Section */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '1rem' }}> {/* Reduced margin */}
          <h4 style={{
            fontSize: '1rem',  // Reduced font size
            marginBottom: '0.5rem',  // Reduced margin
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid #fff',
            paddingBottom: '0.3rem'  // Adjusted padding
          }}>AGRISPOT</h4>
          <p style={{ textDecoration: 'underline', cursor: 'pointer' }}>Find Stores Near Me</p>
        </div>
        <div style={{ marginBottom: '1rem' }}> {/* Reduced margin */}
          <h4 style={{
            fontSize: '1rem',  // Reduced font size
            marginBottom: '0.5rem',  // Reduced margin
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid #fff',
            paddingBottom: '0.3rem'  // Adjusted padding
          }}>GET TO KNOW US</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: '0.3rem' }}><a href="/contact" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid transparent' }}>Contact Us</a></li>
            <li style={{ marginBottom: '0.3rem' }}><a href="/faqs" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid transparent' }}>FAQ's</a></li>
            <li><a href="/blogs" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid transparent' }}>Blogs</a></li>
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}>
        <div style={{ marginBottom: '1rem' }}> {/* Reduced margin */}
          <h4 style={{
            fontSize: '1rem',  // Reduced font size
            marginBottom: '0.5rem',  // Reduced margin
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid #fff',
            paddingBottom: '0.3rem'  // Adjusted padding
          }}>TRACK OR RETURN/EXCHANGE ORDER</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: '0.3rem' }}><a href="/track-order" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid transparent' }}>Track Order</a></li>
            <li style={{ marginBottom: '0.3rem' }}><a href="/return" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid transparent' }}>Explore More</a></li>
            <li><a href="/return-policy" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid transparent' }}>Website Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{
            fontSize: '1rem',  // Reduced font size
            marginBottom: '0.5rem',  // Reduced margin
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid #fff',
            paddingBottom: '0.3rem'  // Adjusted padding
          }}>CUSTOMER CARE</h4>
          <p>Timings: 10 AM - 7 PM (Mon - Sat)</p>
          <p>Whatsapp: +91 6364430801</p>
          <p>Instagram: <a href="https://instagram.com/albinvrgis" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid transparent' }}>@AGRISPOT.co.in</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
