import { z } from "zod";

// Validation schema for creating a class
export const createClassSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    startDate: z.string().refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed > new Date();
    }, "Start date must be a valid future date"),
    endDate: z.string().refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed > new Date();
    }, "End date must be a valid future date"),
    startTime: z
      .string()
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Start time must be in HH:MM format"
      ),
    duration: z.number().int().min(1, "Duration must be at least 1 minute"),
    capacity: z.number().int().min(1, "Capacity must be at least 1"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Validation schema for creating a booking
export const createBookingSchema = z.object({
  memberName: z.string().min(1, "Member name is required"),
  classId: z.string().uuid("Invalid class ID"),
  participationDate: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed > new Date();
  }, "Participation date must be a valid future date"),
});

// Validation schema for searching bookings
export const searchBookingsSchema = z
  .object({
    memberName: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );
