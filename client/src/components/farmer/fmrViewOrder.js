import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './fsidebar';
import Navbar from './fnavbar';
import styles from './fmrViewOrder.module.css';

const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:5000/api/orders/buyer-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch buyer orders', error);
      }
    };
    
    fetchOrders();
  }, []);

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
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
                order.cartItems.map((item, index) => (
                  <tr key={item._id}>
                    {index === 0 && ( 
                      <td rowSpan={order.cartItems.length}>{order._id}</td> // Merged Order ID
                    )}
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    {index === 0 && (
                      <>
                        <td rowSpan={order.cartItems.length}>{order.totalPrice}</td> {/* Merged Total Price */}
                        <td rowSpan={order.cartItems.length}>{order.status}</td> {/* Merged Status */}
                      </>
                    )}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrdersPage;
