// backend/src/controllers/ticketController.js
const Ticket = require('../models/Ticket');
const Flight = require('../models/Flight');
const { v4: uuidv4 } = require('uuid');

exports.bookTicket = async (req, res) => {
  try {
    const { passengerName, email, flightId, seatNumber } = req.body;
    const userId = req.user.userId;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ msg: 'Flight not found' });
    if (flight.availableSeats < 1) return res.status(400).json({ msg: 'No seats available' });

    // Check if seat is already taken
    if (seatNumber && seatNumber !== 'Auto') {
      const existingTicket = await Ticket.findOne({ flight: flightId, seatNumber });
      if (existingTicket) {
        return res.status(400).json({ msg: 'Seat already taken' });
      }
    }

    const ticketId = 'TKT-' + uuidv4().slice(0, 8).toUpperCase();
    const qrData = `${ticketId}|${flight.flightNumber}|${passengerName}`;

    const ticket = new Ticket({
      ticketId,
      passengerName,
      email,
      userId,
      flight: flightId,
      seatNumber: seatNumber || 'Auto',
      qrData,
      baggageCount: 1,
      baggageStatus: 'Not Checked'
    });

    await ticket.save();

    // Reduce available seats
    flight.availableSeats -= 1;
    await flight.save();

    res.status(201).json({
      success: true,
      ticketId,
      qrData,
      message: 'Ticket booked successfully!'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('flight', 'flightNumber origin destination departureTime gate status')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tickets = await Ticket.find({ userId })
      .populate('flight', 'flightNumber origin destination departureTime gate status')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};