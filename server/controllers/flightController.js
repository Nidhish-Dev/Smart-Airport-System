// backend/src/controllers/flightController.js
const Flight = require('../models/Flight');

// Get all flights
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departureTime: 1 });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single flight by ID
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new flight (Admin only)
exports.createFlight = async (req, res) => {
  try {
    const { 
      flightNumber, 
      origin, 
      destination, 
      departureTime, 
      arrivalTime, 
      gate, 
      capacity 
    } = req.body;

    const flight = new Flight({
      flightNumber,
      origin,
      destination,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      gate,
      capacity,
      availableSeats: capacity
    });

    const newFlight = await flight.save();
    res.status(201).json(newFlight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update flight (gate, status, etc.)
exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete flight
exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json({ message: 'Flight deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};