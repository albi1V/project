import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './checkout.module.css'; // Ensure to create corresponding CSS styles

const Checkout = () => {
  const navigate = useNavigate(); // Create navigate function
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');

  // State for address form
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedItems && storedItems.length > 0) {
      console.log('Cart Items:', storedItems); // Log cart items for debugging
      setCartItems(storedItems);
      calculateTotal(storedItems); // Calculate total once after loading cart items
    } else {
      setError('No items in the cart');
    }
  }, []); // Empty array ensures this runs only once on mount

  // Calculate total price function
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    setTotalPrice(total);
  };

  // Handle input changes for address form
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  // Form validation function
  const validateForm = () => {
    const { street, city, state, postalCode, country } = address;
    if (!street || !city || !state || !postalCode || !country) {
      setFormError('Please fill out all address fields');
      return false;
    }
    setFormError('');
    return true;
  };

  // Verify payment function
  const verifyPayment = async (response) => {
    try {
      const verifyResponse = await fetch("https://project-9jg7.onrender.com/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });

      return await verifyResponse.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification error!');
      return { success: false };
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("https://project-9jg7.onrender.com/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: "INR"
        }),
      });

      const data = await response.json();
      if (!data.orderId) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "AGRISPOT PAYMENT GATEWAY",
        description: "Payment for your order",
        order_id: data.orderId,
        handler: async function (response) {
          const verifyResponse = await verifyPayment(response);
          if (verifyResponse.success) {
            alert('Payment successful! Order ID: ' + response.razorpay_order_id);

            // Now save the order details in the database
            const saveResponse = await fetch("https://project-9jg7.onrender.com/api/payment/save-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: localStorage.getItem('userId'), // Assuming you store userId in localStorage
                shippingAddress: address, // Address from the form
                cartItems: cartItems.map(item => ({
                  productId: item.product._id, // Assuming product is available
                  name: item.product.name,
                  price: item.product.price,
                  quantity: item.quantity,
                })),
                totalPrice,
              }),
            });

            const savedOrderData = await saveResponse.json();
            if (saveResponse.ok) {
              // Update stock for each product
              await updateStock();

              alert('Order saved successfully! Order ID: ' + savedOrderData.order._id);
              // Clear the cart and navigate to view-all-products page
              localStorage.removeItem('cartItems');
              navigate('/view-all-products'); // Navigate to view-all-products page
            } else {
              alert('Failed to save order!');
            }
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: "Your Name",
          email: "email@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Payment initiation failed!');
    }
  };

  // Function to update stock
  const updateStock = async () => {
    try {
      await Promise.all(cartItems.map(async (item) => {
        const updateResponse = await fetch(`https://project-9jg7.onrender.com/api/products/update-stock/${item.product._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: item.quantity, // Subtract this quantity from the stock
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update stock for product ID: ' + item.product._id);
        }
      }));
      console.log('Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock!');
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1>Checkout</h1>
      {error && <p className={styles.error}>{error}</p>}

      {/* Two-column Layout */}
      <div className={styles.checkoutLayout}>
        {/* Left Column - Address Form */}
        <div className={styles.addressSection}>
          <h2>Shipping Address</h2>
          {formError && <p className={styles.error}>{formError}</p>}
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="123 Main St"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="Your City"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="Your State"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
                placeholder="ZIP/Postal Code"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                placeholder="Your Country"
              />
            </div>
          </form>
        </div>

        {/* Right Column - Cart Items and Payment Section */}
        <div className={styles.paymentSection}>
          {cartItems.length > 0 ? (
            <div className={styles.cartDetails}>
              <h2>Your Products:</h2>
              {cartItems.map((item, index) => {
                const product = item.product;
                if (!product) {
                  console.error('Missing product details for item:', item);
                  return null;
                }
                return (
                  <div key={index} className={styles.cartItem}>
                    <h3>{product.name ? product.name : 'No Name'} - ₹{product.price?.toFixed(2) || 'N/A'} x {item.quantity}</h3>
                    {product?.images?.length > 0 && (
                      <img
                        src={`https://project-9jg7.onrender.com/api/products/get-product-images/${product.images[0]}`}
                        alt={product.name || 'Product Image'}
                        className={styles.productImage}
                      />
                    )}
                  </div>
                );
              })}
              <h2>Total Price: ₹{totalPrice.toFixed(2)}</h2>
            </div>
          ) : (
            <p>No items in your cart.</p>
          )}

          {/* Payment Section */}
          <button className={styles.paymentButton} onClick={handlePayment}>
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
