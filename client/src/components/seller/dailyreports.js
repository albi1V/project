import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./slrSbar";
import Navbar from "./slrNbar";
import styles from "./dailyreport.module.css"; // Optional, if you want custom styling

const OrderAnalysis = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);

  const sellerId = localStorage.getItem("sellerId"); // Assuming seller ID is stored in localStorage

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrderData();
    }
  }, [startDate, endDate]);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/seller/order-analysis/${sellerId}`,
        {
          params: { startDate, endDate },
        }
      );
      const { totalOrders, totalRevenue, avgOrderValue, orders } = response.data;
      setOrders(orders);
      setTotalOrders(totalOrders);
      setTotalRevenue(totalRevenue);
      setAvgOrderValue(avgOrderValue);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.orderAnalysisContent}>
          <h2 className="text-2xl font-bold mb-4">Order Analysis</h2>

          {/* Date Pickers */}
          <div className="flex gap-4 mb-6">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded-md"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 shadow-md rounded-md">
              <h3 className="text-lg font-semibold">Total Orders</h3>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="bg-white p-4 shadow-md rounded-md">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold">₹{totalRevenue}</p>
            </div>
            <div className="bg-white p-4 shadow-md rounded-md">
              <h3 className="text-lg font-semibold">Avg Order Value</h3>
              <p className="text-2xl font-bold">₹{avgOrderValue}</p>
            </div>
          </div>

          {/* Order Table */}
          <div className="bg-white p-4 shadow-md rounded-md">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Buyer</th>
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="text-center">
                      <td className="border p-2">{order._id}</td>
                      <td className="border p-2">{order.buyerId.username}</td>
                      <td className="border p-2">{order.productId.name}</td>
                      <td className="border p-2">{order.quantity}</td>
                      <td className="border p-2">₹{order.totalPrice}</td>
                      <td className="border p-2">{order.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="border p-4 text-center">
                      No orders found for the selected dates.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalysis;
