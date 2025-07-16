import { Router } from "express";
import {
  createBooking,
  searchBookings,
  getAllBookings,
} from "../controllers/bookingController";

const router = Router();

// POST /api/bookings - Create a new booking
router.post("/", createBooking);

// GET /api/bookings - Get all bookings or search bookings with query parameters
router.get("/", searchBookings);

// GET /api/bookings/all - Get all bookings without any filtering
router.get("/all", getAllBookings);

export default router;
