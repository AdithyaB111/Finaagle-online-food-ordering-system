import express from 'express';
import {
  getAvailability,
  setAvailability,
  reserveSlot,
  getAllReservations
} from '../controllers/availabilityController.js';

const router = express.Router();

router.get('/', getAllReservations);
router.get('/:date', getAvailability);
router.post('/set', setAvailability);
router.post('/reserve', reserveSlot);

export default router;
