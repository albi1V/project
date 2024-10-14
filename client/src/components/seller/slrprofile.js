import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './slrprofile.module.css'; // Importing CSS module

const SellerProfile = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [userProducts, setUserProducts] = useState([]); // Store products
  const [loading, setLoading] = useState(true);   // Loading state
  const [productError, setProductError] = useState(''); // Error state for products
  const [deletingProductId, setDeletingProductId] = useState(null); // Track which product is being deleted
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track current image index for each product
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email'); // Get the email stored during login

      if (!token || !email) {
        setProductError('Unauthorized');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:5000/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        });

        setUserData(userResponse.data);

        // Fetch user's products using the sellerEmail
        const sellerEmail = userResponse.data.email; // Assuming the email is used as sellerEmail
        const productsResponse = await axios.get(`http://localhost:5000/api/products/user/${sellerEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        });

        if (productsResponse.data.length === 0) {
          setUserProducts([]); // No products found, set empty array
        } else {
          setUserProducts(productsResponse.data); // Store the user's products
          // Initialize current image index for each product
          const initialIndexes = productsResponse.data.reduce((acc, product) => {
            acc[product._id] = 0; // Start with the first image for each product
            return acc;
          }, {});
          setCurrentImageIndex(initialIndexes);
        }

        setLoading(false);
      } catch (error) {
        setProductError('Failed to fetch products. Please add products.'); // Handle error if fetching fails
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');

    try {
      setDeletingProductId(productId); // Track which product is being deleted
      await axios.delete(`http://localhost:5000/api/products/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authorization
        },
      });

      // Remove the deleted product from the state
      setUserProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      setDeletingProductId(null); // Reset deleting product ID
      const { [productId]: removed, ...rest } = currentImageIndex; // Remove deleted product's image index
      setCurrentImageIndex(rest);
    } catch (error) {
      setProductError('Failed to delete product');
      setDeletingProductId(null);
    }
  };

  const handleNextImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const product = userProducts.find((prod) => prod._id === productId);
      const nextIndex = (prev[productId] + 1) % (product.images.length || 1); // Loop through images
      return { ...prev, [productId]: nextIndex };
    });
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>Seller Profile</h1>

      {userData && (
        <div className={styles.userInfo}>
          <p><strong>Full Name:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Address:</strong> {userData.address}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Account Created:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>

          <button className={styles.editButton} onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
        </div>
      )}

      <h2 className={styles.productTitle}>Your Products</h2>
      {productError ? (
        <p className={styles.error}>{productError}</p>
      ) : (
        <>
          {userProducts.length === 0 ? (
            <div>
              <p>No products found</p>
              {/* Add Product Button */}
              <button className={styles.addButton} onClick={() => {
                console.log('Navigating to add product page');
                navigate('/add-product');
              }}>
                Add Product
              </button>
            </div>
          ) : (
            <div className={styles.productList}>
              {userProducts.map((product) => (
                <div key={product._id} className={styles.productItem}>
                  <h3>{product.name}</h3>
                  {/* <p>{product.description}</p> */}
                  
                  <div className={styles.imageContainer}>
                    {product.images && product.images.length > 0 && (
                      <>
                        <img
                          src={`http://localhost:5000/api/products/get-product-images/${product.images[currentImageIndex[product._id]]}`}
                          alt={product.name}
                          className={styles.productImage}
                        />
                        <button
                          className={styles.nextButton}
                          onClick={() => handleNextImage(product._id)}
                        >
                          Next
                        </button>
                      </>
                    )}
                  </div>
                  
                  <p><strong>Price:</strong> ₹{product.price}</p>
                  <p><strong>Posted on:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>

                  {/* Edit Button for Navigating to EditProduct Page */}
                  <button
                    className={styles.editButton}
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={deletingProductId === product._id} // Disable if product is being deleted
                  >
                    {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerProfile;
