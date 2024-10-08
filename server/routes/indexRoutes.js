const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const blogRoutes = require('./blogRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const schemeRoutes = require('./schemeRoutes');



            
router.use('/auth',authRoutes)

router.use('/blog', blogRoutes);

router.use('/products', productRoutes);

router.use('/cart', cartRoutes);

router.use('/schemes', schemeRoutes);


module.exports = router;
