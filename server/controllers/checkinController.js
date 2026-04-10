const Ticket = require('../models/Ticket');

exports.scanAndCheckin = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ msg: 'QR data is required' });
    }

    const ticket = await Ticket.findOne({ qrData }).populate('flight');

    if (!ticket) {
      return res.status(404).json({ msg: 'Invalid or expired QR code' });
    }

    if (ticket.checkedIn) {
      return res.status(400).json({ msg: 'Ticket already checked in' });
    }

    // Perform check-in
    ticket.checkedIn = true;
    ticket.baggageStatus = 'Checked';
    await ticket.save();

    // 🔥 Emit real-time update using the correct method (no socket.io-client needed)
    const io = req.app.get('io');
    if (io) {
      io.emit('ticket-checked-in', {
        ticketId: ticket.ticketId,
        passengerName: ticket.passengerName,
        flightNumber: ticket.flight?.flightNumber,
        seatNumber: ticket.seatNumber,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      msg: '✅ Check-in successful!',
      ticket
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during check-in' });
  }
};