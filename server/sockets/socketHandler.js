module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('checkin-success', (data) => {
      io.emit('ticket-checked-in', data);   // Real-time update to all dashboards
    });

    socket.on('disconnect', () => console.log('User disconnected'));
  });
};