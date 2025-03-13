import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import Sidebar from "./slrSbar";
import Navbar from "./slrNbar";
import styles from "./slrViewOrder.module.css";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://project-9jg7.onrender.com/api/orders/seller-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        setError("Failed to fetch seller orders");
        console.error("Failed to fetch seller orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const approveOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://project-9jg7.onrender.com/api/orders/approve-order/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "Approved" } : order
        )
      );

      // Use SweetAlert for success message
      Swal.fire({
        icon: "success",
        title: "Order Approved",
        text: "The order has been approved successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to approve order", error);

      // Use SweetAlert for error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve order. Please try again.",
      });
    }
  };

  const declineOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://project-9jg7.onrender.com/api/orders/decline-order/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "Declined" } : order
        )
      );

      // Use SweetAlert for decline message
      Swal.fire({
        icon: "warning",
        title: "Order Declined",
        text: "The order has been declined.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to decline order", error);

      // Use SweetAlert for error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to decline order. Please try again.",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.orderList}>
          <h1>Orders for Your Products</h1>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Total Price</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      {order.cartItems?.map((item) => (
                        <div key={item._id}>{item.name}</div>
                      ))}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.shippingAddress
                        ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}`
                        : "No address provided"}
                    </td>
                    <td>{order.status}</td>
                    <td>
                      {order.status === "Pending" ? (
                        <>
                          <button
                            id="approveOrderBtn"
                            className={styles.approveBtn}
                            onClick={() => approveOrder(order._id)}
                          >
                            Approve
                          </button>
                          <button
                            id="rejectOrderBtn"
                            className={styles.rejectBtn}
                            onClick={() => declineOrder(order._id)}
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className={styles.statusLabel}>
                          {order.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerOrdersPage;
