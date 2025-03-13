const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const blogRoutes = require('./blogRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const schemeRoutes = require('./schemeRoutes');
const wasteRoutes = require('./wasteRoutes');
const trendRoutes = require('./trendRoutes')
const trendSellRoutes = require('./trendSellRoutes')
const userControleRoutes = require('./userControleRoutes')
const adminConsoleRoutes = require('./adminConsoleRoutes')
const orderRoutes = require('./orderRoutes')
const reportRoutes = require('./reportRoutes')
const PaymentRoutes = require('./PaymentRoutes')
const plantlocRoutes = require('./plantLocRoutes')
const newsRoutes = require('./newsRoutes')
const sellerRoutes=require('./sellerRoutes')
const mlRoutes = require('./mlRoutes')



            
router.use('/auth',authRoutes)

router.use('/blog', blogRoutes);

router.use('/products', productRoutes);

router.use('/cart', cartRoutes);

router.use('/schemes', schemeRoutes);

router.use('/waste', wasteRoutes);

router.use('/trend',trendRoutes)

router.use('/trendsell',trendSellRoutes)

router.use('/usercontrole',userControleRoutes)

router.use('/adminconsole',adminConsoleRoutes)

router.use('/orders',orderRoutes)

router.use('/report',reportRoutes)

router.use('/payment',PaymentRoutes)

router.use('/plantlocation',plantlocRoutes)

router.use('/news',newsRoutes)

router.use('/seller',sellerRoutes)

router.use('/ml',mlRoutes)

module.exports = router;
