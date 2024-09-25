import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./registration.module.css";
import axios from "axios";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); 
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();

// Validate Username (no digits, special characters, and no consecutive spaces)
const validateUsername = (name) => {
  const isValid = /^[A-Za-z\s]+$/.test(name) && !/\s{2,}/.test(name);
  setUsernameError(
    isValid
      ? ""
      : "Username should only contain letters and spaces, and no consecutive spaces."
  );
};

// Validate Address (no special characters and no consecutive spaces)
const validateAddress = (address) => {
  const isValid = /^[A-Za-z0-9\s]+$/.test(address) && !/\s{2,}/.test(address);
  setAddressError(
    isValid
      ? ""
      : "Address should not contain special characters or consecutive spaces."
  );
};

  // Validate Phone (only numbers starting with 6,7,8,9)
  const validatePhone = (number) => {
    const isValid = /^[6-9]\d{9}$/.test(number);
    const hasConsecutiveDigits = /(.)\1{5,}/.test(number);

    if (!isValid) {
      setPhoneError("Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits.");
    } else if (hasConsecutiveDigits) {
      setPhoneError("Phone number cannot have the same digit more than 5 times consecutively.");
    } else {
      setPhoneError("");
    }
  };

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordCriteria(criteria);

    const allCriteriaMet =
      criteria.length &&
      criteria.uppercase &&
      criteria.lowercase &&
      criteria.number &&
      criteria.special;

    setPasswordError(
      allCriteriaMet ? "" : "Password does not meet the required criteria."
    );
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value); // Call the validation function for username
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    validateAddress(value); // Call the validation function for address
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    validatePhone(value); // Call the validation function for phone number
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleOTPSend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      console.log(response);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = {
      username,
      email,
      role,
      phone,
      password,
      address,
      otp,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);

      if (response.data.status === 1) {
        setSuccessMessage(response.data.message);
        setErrorMessage(""); // Clear any previous error message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message)
      console.error('Error during registration:', error.response?.data || error.message);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.registrationPage}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Register</h2>
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleRegister} className={styles.registrationForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            {usernameError && <p className={styles.error}>{usernameError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>Select your role</option>
              <option value="farmer">Farmer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              required
            />
            {addressError && <p className={styles.error}>{addressError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            {phoneError && <p className={styles.error}>{phoneError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            onClick={handleOTPSend}
            className={styles.otpBtn}
          >
            Send OTP
          </button>

          <div className={styles.formGroup}>
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className={styles.toggleButton}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            <div className={styles.passwordRequirements}>
              <p className={passwordCriteria.length ? styles.valid : styles.invalid}>At least 8 characters</p>
              <p className={passwordCriteria.uppercase ? styles.valid : styles.invalid}>At least one uppercase letter</p>
              <p className={passwordCriteria.lowercase ? styles.valid : styles.invalid}>At least one lowercase letter</p>
              <p className={passwordCriteria.number ? styles.valid : styles.invalid}>At least one number</p>
              <p className={passwordCriteria.special ? styles.valid : styles.invalid}>At least one special character</p>
            </div>
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className={styles.toggleButton}
              >
                {confirmPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
