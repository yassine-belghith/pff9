const Reservation = require('../models/Reservation');

// POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // if auth middleware set
    const { datetime, services } = req.body;

    if (!datetime || !services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const reservation = new Reservation({ user: userId, datetime, services });
    await reservation.save();
    res.status(201).json({ reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create reservation' });
  }
};

// GET /api/client/reservations
exports.cancelReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const reservation = await Reservation.findOne({ _id: id, user: userId });
    if (!reservation) return res.status(404).json({ message: 'Not found' });
    if (reservation.status !== 'pending') return res.status(400).json({ message: 'Cannot cancel' });
    reservation.status = 'canceled';
    await reservation.save();
    res.json({ reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel' });
  }
};

exports.listClientReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load reservations' });
  }
};
