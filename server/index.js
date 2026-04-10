// backend/src/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'].filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
};

// Socket.io setup with proper CORS
const io = new Server(server, {
  cors: corsOptions,
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Make io accessible in all controllers (important for real-time check-in)
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/checkin', require('./routes/checkinRoutes'));

// Socket.io real-time handler
require('./sockets/socketHandler')(io);

// Basic health check route
app.get('/', (req, res) => {
  res.send('✅ Smart Flight System Backend is running!');
});

// Global error handler (optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io is ready for real-time updates`);
});