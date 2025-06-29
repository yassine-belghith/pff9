const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const siteAvailability = require('./middleware/siteAvailability');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const adminServiceRoutes = require('./routes/adminServiceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const clientReservationRoutes = require('./routes/clientReservationRoutes');

const app = express();

// Basic middleware
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: false
}));

// Middleware to check if site is active (maintenance mode)
app.use(siteAvailability);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Headers:`, req.headers);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message });
});

// Routes (order matters)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin/clients', clientRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api', catalogRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/client/reservations', clientReservationRoutes);
app.use('/api', serviceRoutes);
app.use('/api/admin', adminServiceRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});
