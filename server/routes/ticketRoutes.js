// backend/src/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Book a ticket
router.post('/book', ticketController.bookTicket);

// Get all tickets (for admin/operations)
router.get('/', ticketController.getMyTickets);

// You can add more later: get ticket by ID, cancel ticket, etc.

module.exports = router;