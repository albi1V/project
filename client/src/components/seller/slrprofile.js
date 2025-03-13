import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './slrSbar';
import Navbar from './slrNbar';
import { useNavigate } from 'react-router-dom';
import styles from './slrprofile.module.css';

const SellerProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (!token || !email) {
        setProductError('Unauthorized');
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(`http://localhost:5000/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(userResponse.data);

        const sellerEmail = userResponse.data.email;
        const productsResponse = await axios.get(`http://localhost:5000/api/products/user/${sellerEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserProducts(productsResponse.data);
        const initialIndexes = productsResponse.data.reduce((acc, product) => {
          acc[product._id] = 0;
          return acc;
        }, {});
        setCurrentImageIndex(initialIndexes);
      } catch (error) {
        setProductError('Failed to fetch products. Please add products.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');

    try {
      setDeletingProductId(productId);
      await axios.delete(`http://localhost:5000/api/products/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      const { [productId]: removed, ...rest } = currentImageIndex;
      setCurrentImageIndex(rest);
    } catch (error) {
      setProductError('Failed to delete product');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleNextImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const product = userProducts.find((prod) => prod._id === productId);
      const nextIndex = (prev[productId] + 1) % (product.images.length || 1);
      return { ...prev, [productId]: nextIndex };
    });
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
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

              <button className={styles.editButton} onClick={() => navigate('/slr-edit-profile')}>
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
                  <button className={styles.addButton} onClick={() => navigate('/add-product')}>
                    Add Product
                  </button>
                </div>
              ) : (
                <div className={styles.productList}>
                  {userProducts.map((product) => (
                    <div key={product._id} className={styles.productItem}>
                      <h3>{product.name}</h3>

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

                      <button
                        className={styles.editButton}
                        onClick={() => navigate(`/edit-product/${product._id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingProductId === product._id}
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
      </div>
    </div>
  );
};

export default SellerProfile;
