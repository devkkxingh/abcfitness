import { prisma } from "../lib/database";
import { parseDate, isSameDay } from "../lib/utils";

export interface CreateBookingData {
  memberName: string;
  classId: string;
  participationDate: string;
}

export interface BookingWithClass {
  id: string;
  memberName: string;
  participationDate: Date;
  classInstance: {
    id: string;
    date: Date;
    class: {
      id: string;
      name: string;
      startTime: string;
      duration: number;
      capacity: number;
    };
  };
}

export interface FormattedBooking {
  id: string;
  memberName: string;
  participationDate: Date;
  className: string;
  classStartTime: string;
  classDuration: number;
  classCapacity: number;
}

export interface SearchBookingsParams {
  memberName?: string;
  startDate?: string;
  endDate?: string;
}

export class BookingModel {
  //Create a new booking with capacity validation
  static async createBooking(
    data: CreateBookingData
  ): Promise<BookingWithClass> {
    const { memberName, classId, participationDate } = data;

    const participationDateObj = parseDate(participationDate);

    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        instances: {
          include: {
            bookings: true,
          },
        },
      },
    });

    if (!classItem) {
      throw new Error("Class not found");
    }

    // Check if the participation date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (participationDateObj < today) {
      throw new Error("Participation date must be in the future");
    }

    // Check if the participation date is within the class date range
    if (
      participationDateObj < classItem.startDate ||
      participationDateObj > classItem.endDate
    ) {
      throw new Error("Participation date must be within the class date range");
    }

    // Find the specific class instance for the participation date
    const classInstance = classItem.instances.find((instance: any) =>
      isSameDay(instance.date, participationDateObj)
    );

    if (!classInstance) {
      throw new Error(`No class instance found for date ${participationDate}`);
    }

    // Check if the class instance has reached capacity
    const currentBookings = classInstance.bookings.length;
    if (currentBookings >= classItem.capacity) {
      throw new Error(
        `Class is full. Current bookings: ${currentBookings}, Capacity: ${classItem.capacity}`
      );
    }

    // Create the booking
    const newBooking = await prisma.booking.create({
      data: {
        memberName,
        participationDate: participationDateObj,
        classInstanceId: classInstance.id,
      },
      include: {
        classInstance: {
          include: {
            class: true,
          },
        },
      },
    });

    return newBooking;
  }

  // Search bookings based on criteria
  static async searchBookings(
    params: SearchBookingsParams
  ): Promise<FormattedBooking[]> {
    const { memberName, startDate, endDate } = params;

    const whereClause: any = {};

    if (memberName) {
      whereClause.memberName = {
        contains: memberName,
      };
    }

    if (startDate && endDate) {
      whereClause.participationDate = {
        gte: parseDate(startDate),
        lte: parseDate(endDate),
      };
    } else if (startDate) {
      whereClause.participationDate = {
        gte: parseDate(startDate),
      };
    } else if (endDate) {
      whereClause.participationDate = {
        lte: parseDate(endDate),
      };
    }

    // Search bookings
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        classInstance: {
          include: {
            class: true,
          },
        },
      },
      orderBy: {
        participationDate: "asc",
      },
    });

    return this.formatBookings(bookings);
  }

  // Get all bookings
  static async getAllBookings(): Promise<FormattedBooking[]> {
    const bookings = await prisma.booking.findMany({
      include: {
        classInstance: {
          include: {
            class: true,
          },
        },
      },
      orderBy: {
        participationDate: "asc",
      },
    });

    return this.formatBookings(bookings);
  }

  // Format bookings for consistent API response
  private static formatBookings(
    bookings: BookingWithClass[]
  ): FormattedBooking[] {
    return bookings.map((booking) => ({
      id: booking.id,
      memberName: booking.memberName,
      participationDate: booking.participationDate,
      className: booking.classInstance.class.name,
      classStartTime: booking.classInstance.class.startTime,
      classDuration: booking.classInstance.class.duration,
      classCapacity: booking.classInstance.class.capacity,
    }));
  }

  // Get booking by ID
  static async getBookingById(id: string): Promise<BookingWithClass | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        classInstance: {
          include: {
            class: true,
          },
        },
      },
    });
  }

  // Check if a booking exists
  static async bookingExists(id: string): Promise<boolean> {
    const bookingCount = await prisma.booking.count({
      where: { id },
    });
    return bookingCount > 0;
  }
}
