import { prisma } from "../lib/database";
import { generateClassInstances, parseDate } from "../lib/utils";

export interface CreateClassData {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  duration: number;
  capacity: number;
}

export interface ClassWithInstances {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  duration: number;
  capacity: number;
  instances: {
    id: string;
    date: Date;
    bookings: any[];
  }[];
}

export class ClassModel {
  // Create a new class with automatic generation of class instances
  static async createClass(data: CreateClassData): Promise<ClassWithInstances> {
    const { name, startDate, endDate, startTime, duration, capacity } = data;

    // Parse dates
    const startDateObj = parseDate(startDate);
    const endDateObj = parseDate(endDate);

    // Create the class
    const newClass = await prisma.class.create({
      data: {
        name,
        startDate: startDateObj,
        endDate: endDateObj,
        startTime,
        duration,
        capacity,
      },
    });

    // Generate class instances for each day
    const instancesData = generateClassInstances(startDateObj, endDateObj);

    // Create class instances
    await Promise.all(
      instancesData.map((instanceData) =>
        prisma.classInstance.create({
          data: {
            date: instanceData.date,
            classId: newClass.id,
          },
        })
      )
    );

    // Return the created class with instances
    const classWithInstances = await prisma.class.findUnique({
      where: { id: newClass.id },
      include: {
        instances: {
          orderBy: { date: "asc" },
          include: {
            bookings: true,
          },
        },
      },
    });

    if (!classWithInstances) {
      throw new Error("Failed to retrieve created class");
    }

    return classWithInstances;
  }

  // Get all classes
  static async getAllClasses(): Promise<ClassWithInstances[]> {
    return await prisma.class.findMany({
      include: {
        instances: {
          orderBy: { date: "asc" },
          include: {
            bookings: true,
          },
        },
      },
      orderBy: { startDate: "asc" },
    });
  }

  // Get a specific class by ID
  static async getClassById(id: string): Promise<ClassWithInstances | null> {
    return await prisma.class.findUnique({
      where: { id },
      include: {
        instances: {
          orderBy: { date: "asc" },
          include: {
            bookings: true,
          },
        },
      },
    });
  }

  // Check if a class exists
  static async classExists(id: string): Promise<boolean> {
    const classCount = await prisma.class.count({
      where: { id },
    });
    return classCount > 0;
  }

  // Get class with instances and bookings for capacity checking
  static async getClassWithInstancesAndBookings(
    id: string
  ): Promise<ClassWithInstances | null> {
    return await prisma.class.findUnique({
      where: { id },
      include: {
        instances: {
          include: {
            bookings: true,
          },
        },
      },
    });
  }
}
