const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
// const farmerRoutes = require('./farmerRoutes');


            
router.use('/auth',authRoutes)
//router.use('/farmer',farmerRoutes);
// router.use('/register', registerroutes);
// router.use('/blog', blogRoutes);

module.exports = router;
