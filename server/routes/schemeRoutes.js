const express = require('express');
const router = express.Router();
const { addScheme,getAllSchemes,deleteScheme,editScheme,getSchemeById,getSchemeFile} = require('../controllers/schemeController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add-schemes', authMiddleware, addScheme); 

router.get('/viewall', getAllSchemes); 

router.delete('/delete/:schemeId', deleteScheme);

router.get('/get-scheme-by-id/:schemeId', getSchemeById);  

router.put('/edit/:schemeId', editScheme);  

 router.get('/get-scheme-files/:filename', getSchemeFile)

module.exports = router;
