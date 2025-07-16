import { z } from "zod";

// Helper function to check if date is in the future
const isFutureDate = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  const inputDate = new Date(date);
  return inputDate >= today;
};

// Create Class validation schema
export const createClassSchema = z
  .object({
    name: z.string().min(1, "Class name is required"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(isFutureDate, "Start date must be a valid future date"),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine(isFutureDate, "End date must be a valid future date"),
    startTime: z.string().min(1, "Start time is required"),
    duration: z
      .number()
      .min(1, "Duration must be at least 1 minute")
      .positive("Duration must be positive"),
    capacity: z
      .number()
      .min(1, "Capacity must be at least 1")
      .positive("Capacity must be positive"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );

// Book Class validation schema
export const bookClassSchema = z.object({
  memberName: z.string().min(1, "Your name is required"),
  participationDate: z
    .string()
    .min(1, "Please select a date")
    .refine((date) => {
      // Basic date validation - ensure it's a valid date
      const selectedDate = new Date(date);
      return !isNaN(selectedDate.getTime());
    }, "Please select a valid date")
    .refine(isFutureDate, "Participation date must be in the future"),
});

// Dynamic validation schema for booking with class context
export const createBookingSchemaWithClassContext = (
  classStartDate: string,
  classEndDate: string
) => {
  return bookClassSchema.refine(
    (data) => {
      const participationDate = new Date(data.participationDate);
      const startDate = new Date(classStartDate);
      const endDate = new Date(classEndDate);

      return participationDate >= startDate && participationDate <= endDate;
    },
    {
      message: "Participation date must be within the class date range",
      path: ["participationDate"],
    }
  );
};

// Export types for TypeScript
export type CreateClassFormData = z.infer<typeof createClassSchema>;
export type BookClassFormData = z.infer<typeof bookClassSchema>;
