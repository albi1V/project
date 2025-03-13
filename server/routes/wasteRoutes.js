const express = require('express');
const { submitWasteRequest, getWasteRequests, acceptWasteRequest, rejectWasteRequest,getUserWasteRequests,getBlogImages } = require('../controllers/wasteController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/request', authMiddleware, submitWasteRequest);

router.get('/get-request',  getWasteRequests);

router.post('/accept/:id',  acceptWasteRequest);

router.post('/reject/:id', rejectWasteRequest);

router.get('/my-requests', authMiddleware, getUserWasteRequests);

router.get('/get-waste-images/:filename', getBlogImages)

module.exports = router;

