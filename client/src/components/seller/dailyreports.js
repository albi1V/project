import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./slrSbar";
import Navbar from "./slrNbar";
import styles from "./dailyreport.module.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import notoFont from "../../fonts/notoFont";
// Optional, if you want custom styling

const OrderAnalysis = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);

  const sellerId = localStorage.getItem("email");

  useEffect(() => {
    fetchOrderData(); // Fetch all orders on page load
  }, []);

  const fetchOrderData = async (filter = false) => {
    try {
      let url = `https://project-9jg7.onrender.com/api/seller/order-analysis/${sellerId}`;
      if (filter && startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(url);
      const { totalOrders, totalRevenue, avgOrderValue, orders } =
        response.data;
      setOrders(orders);
      setTotalOrders(totalOrders);
      setTotalRevenue(totalRevenue);
      setAvgOrderValue(avgOrderValue);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
  
    // Add the custom font
    doc.addFileToVFS("NotoSans.ttf", notoFont);
    doc.addFont("NotoSans.ttf", "NotoSans", "normal");
    doc.setFont("NotoSans");

    // Title
    doc.setFontSize(18);
    doc.text("Order Analysis Report", 75, 20);
  
    // Summary Details
    doc.setFontSize(12);
    doc.text(`Total Orders: ${totalOrders}`, 14, 30);
    doc.text(`Total Revenue: \u20B9${totalRevenue}`, 14, 40); // Use Unicode ₹
    doc.text(`Avg Order Value: \u20B9${avgOrderValue}`, 14, 50); // Use Unicode ₹
  
    // Table Headers
    const tableColumn = ["Order ID", "Buyer", "Product", "Quantity", "Price", "Status"];
    const tableRows = [];
  
    // Add Order Data to Table
    orders.forEach((order) => {
      const rowData = [
        order._id,
        order.buyerId?.username || "N/A",
        order.productId?.name || "N/A",
        order.quantity,
        `\u20B9${order.totalPrice}`, // Use Unicode ₹
        order.status,
      ];
      tableRows.push(rowData);
    });

    // ✅ Set font explicitly in autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      styles: { font: "NotoSans" }, // ✅ Fix ₹ symbol in table
    });
  
    // Save the PDF
    doc.save("Order_Analysis_Report.pdf");
};

  

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.orderAnalysisContent}>
          <h2 className="text-2xl font-bold mb-4">Order Analysis</h2>

          {/* Date Pickers & Button */}
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
            <button
              onClick={() => fetchOrderData(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Get Report
            </button>
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

          <button
            onClick={downloadReport}
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Download PDF
          </button>

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
                      No orders found.
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
