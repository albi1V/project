import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './fsidebar'; // Import Sidebar component
import Navbar from './fnavbar';
import styles from './fmrViewOrder.module.css'; // Import your CSS module correctly

const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch buyer's orders
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust based on where you store your token
        const response = await axios.get('http://localhost:5000/api/orders/buyer-orders', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setOrders(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch buyer orders', error);
      }
    };
    
    fetchOrders();
  }, []);

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Navbar component */}
      <div className={styles.adminLayout}>
        <Sidebar /> {/* Sidebar component */}
        <div className={styles.ordersContainer}>
          <h2 className={styles.ordersHeading}>Your Orders</h2>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}> {/* Unique key for each order */}
                  <td>{order._id}</td>
                  {/* Loop through each item in the cartItems array */}
                  {order.cartItems.map(item => (
                    <React.Fragment key={item._id}> {/* Unique key for each cart item */}
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.status}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrdersPage;
