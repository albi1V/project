import React from 'react';

const Header = (
  // logoutfunction
) => {

  return (
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
            <select style={{
              backgroundColor: '#2f8f2f',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
            }}>
              
              <option value="profie"> Profile</option>
              <option value="editProfile">edit</option>
              <option value="logout">Logout</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
