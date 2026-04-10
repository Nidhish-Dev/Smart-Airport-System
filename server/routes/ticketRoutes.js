// backend/src/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// Book a ticket
router.post('/book', auth, ticketController.bookTicket);

// Get my tickets
router.get('/my', auth, ticketController.getMyTickets);

// Get all tickets (for admin/operations)
router.get('/', ticketController.getAllTickets);

// You can add more later: get ticket by ID, cancel ticket, etc.

module.exports = router;