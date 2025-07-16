import { Request, Response } from "express";
import { createBookingSchema, searchBookingsSchema } from "../lib/validation";
import { BookingModel } from "../models/bookingModel";

// Create a new booking for a class
export async function createBooking(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = createBookingSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }

    // Create the booking using the model
    const newBooking = await BookingModel.createBooking(validationResult.data);

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message.includes("Class not found")) {
        return res.status(404).json({
          error: "Class not found",
          message: error.message,
        });
      }

      if (
        error.message.includes("Class is full") ||
        error.message.includes("participation date") ||
        error.message.includes("No class instance found")
      ) {
        return res.status(400).json({
          error: "Booking validation failed",
          message: error.message,
        });
      }
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create booking",
    });
  }
}

// Search bookings based on member name and/or date range
export async function searchBookings(req: Request, res: Response) {
  try {
    // Validate query parameters
    const validationResult = searchBookingsSchema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }

    // Search bookings using the model
    const bookings = await BookingModel.searchBookings(validationResult.data);

    res.json({
      message: "Bookings retrieved successfully",
      bookings,
      totalFound: bookings.length,
    });
  } catch (error) {
    console.error("Error searching bookings:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to search bookings",
    });
  }
}

// Get all bookings
export async function getAllBookings(req: Request, res: Response) {
  try {
    const bookings = await BookingModel.getAllBookings();

    res.json({
      message: "All bookings retrieved successfully",
      bookings,
      totalFound: bookings.length,
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve bookings",
    });
  }
}
