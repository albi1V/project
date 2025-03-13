const express = require('express');
const router = express.Router();
const { sendOtp, validateOtp, register, login, googleLogin,forgotPassword,resetPassword} = require('../controllers/authController'); 
const { getUserData,updateUserProfile,createAdmin,} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/send-otp', sendOtp);   
router.post('/validate-otp', validateOtp); 
router.post('/register', register); 
router.post('/login', login);    
router.get('/user/:email', getUserData);

//router.post('/google-login', googleLogin); 
router.post('/forgot-password',forgotPassword );
router.post('/reset-password/:token',resetPassword);
router.put('/user/:email', updateUserProfile);
router.post('/create-admin', createAdmin);

module.exports = router;
