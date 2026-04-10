// backend/src/routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// GET all flights
router.get('/', flightController.getAllFlights);

// GET single flight
router.get('/:id', flightController.getFlightById);

// POST create flight (Admin)
router.post('/', flightController.createFlight);

// PUT update flight
router.put('/:id', flightController.updateFlight);

// DELETE flight
router.delete('/:id', flightController.deleteFlight);

module.exports = router;