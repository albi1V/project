import React from 'react';
import styles from './paymentPage.module.css';

const PaymentPage = () => {
  const handlePaymentSubmit = () => {
    // Add payment logic here (API call or payment gateway integration)
    alert('Payment successful!'); // Placeholder for successful payment
  };

  return (
    <div className={styles.paymentPageContainer}>
      <h1>Payment Page</h1>

      {/* Add payment options (e.g., credit card, net banking) */}
      <div className={styles.paymentOptions}>
        <h2>Select Payment Method</h2>
        <form onSubmit={handlePaymentSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Card Number</label>
            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="expiry">Expiry Date</label>
            <input type="text" id="expiry" placeholder="MM/YY" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cvv">CVV</label>
            <input type="password" id="cvv" placeholder="***" required />
          </div>

          <button type="submit" className={styles.payButton}>
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
