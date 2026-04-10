const mongoose = require('mongoose');
const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  origin: String,
  destination: String,
  departureTime: Date,
  arrivalTime: Date,
  gate: String,
  status: { type: String, enum: ['On Time', 'Delayed', 'Boarding', 'Departed'], default: 'On Time' },
  capacity: Number,
  availableSeats: Number
});
module.exports = mongoose.model('Flight', flightSchema);