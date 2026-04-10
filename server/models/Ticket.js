const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, required: true },
  passengerName: String,
  email: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
  seatNumber: String,
  qrData: String,           // this is what will be encoded in QR
  checkedIn: { type: Boolean, default: false },
  baggageCount: { type: Number, default: 1 },
  baggageStatus: { type: String, default: 'Not Checked' }
});
module.exports = mongoose.model('Ticket', ticketSchema);