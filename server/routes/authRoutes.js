const express = require('express');
const router = express.Router();
const { sendOtp, validateOtp, register, login, googleLogin,forgotPassword,resetPassword, updateUserProfile } = require('../controllers/authController'); 
const { getUserData } = require('../controllers/userController');

router.post('/send-otp', sendOtp);   
router.post('/validate-otp', validateOtp); 
router.post('/register', register); 
router.post('/login', login);    
router.get('/user/:email', getUserData);
router.post('/google-login', googleLogin); 
router.post('/forgot-password',forgotPassword );
router.post('/reset-password/:token', resetPassword);
//router.post('/edit-profile', updateUserProfile );


module.exports = router;
