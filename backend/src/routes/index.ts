import { Router } from "express";
import classRoutes from "./classRoutes";
import bookingRoutes from "./bookingRoutes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    message: "ABC Ignite API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
router.use("/classes", classRoutes);
router.use("/bookings", bookingRoutes);

export default router;
