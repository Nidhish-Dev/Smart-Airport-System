// backend/src/routes/checkinRoutes.js
const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');

// QR Code Check-in
router.post('/scan', checkinController.scanAndCheckin);

module.exports = router;