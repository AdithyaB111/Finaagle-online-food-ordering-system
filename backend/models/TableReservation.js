import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  time: {
    type: String, // e.g., "09:00 - 11:00"
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  reservedBy: {
    type: String, // Optional: store user ID, email, or name
    default: null
  }
});

const tableReservationSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  date: {
    type: String, // format: 'YYYY-MM-DD'
    required: true
  },
  slots: {
    type: [slotSchema],
    required: true
  }
});

const TableReservation = mongoose.model('TableReservation', tableReservationSchema);

export default TableReservation;
