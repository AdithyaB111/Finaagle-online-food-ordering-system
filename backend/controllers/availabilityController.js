import TableReservation from '../models/TableReservation.js';

// Get availability for a specific date
export const getAvailability = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await TableReservation.find({ date });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Set or update availability for a table
export const setAvailability = async (req, res) => {
  const { tableNumber, date, slots } = req.body;

  try {
    let reservation = await TableReservation.findOne({ tableNumber, date });

    if (reservation) {
      reservation.slots = slots;
    } else {
      reservation = new TableReservation({ tableNumber, date, slots });
    }

    await reservation.save();
    res.json({ message: 'Availability updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// User: Reserve a specific slot
export const reserveSlot = async (req, res) => {
  const { tableNumber, date, time } = req.body;

  try {
    const reservation = await TableReservation.findOne({ tableNumber, date });
    if (!reservation) return res.status(404).json({ error: 'Table not found' });

    const slot = reservation.slots.find(s => s.time === time);
    if (!slot || !slot.isAvailable) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    slot.isAvailable = false;
    await reservation.save();
    res.json({ message: 'Reserved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get all reservations (for admin panel)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await TableReservation.find({});
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};
