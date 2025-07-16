import { Request, Response } from "express";
import { createClassSchema } from "../lib/validation";
import { ClassModel } from "../models/classModel";

/**
 * Create a new class with automatic generation of class instances
 */
export async function createClass(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = createClassSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }

    // Create the class using the model
    const classWithInstances = await ClassModel.createClass(
      validationResult.data
    );

    res.status(201).json({
      message: "Class created successfully",
      class: classWithInstances,
      totalInstances: classWithInstances.instances.length,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Failed to create class",
    });
  }
}

/**
 * Get all classes
 */
export async function getAllClasses(req: Request, res: Response) {
  try {
    const classes = await ClassModel.getAllClasses();

    res.json({
      message: "Classes retrieved successfully",
      classes,
    });
  } catch (error) {
    console.error("Error retrieving classes:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve classes",
    });
  }
}

/**
 * Get a specific class by ID
 */
export async function getClassById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const classItem = await ClassModel.getClassById(id);

    if (!classItem) {
      return res.status(404).json({
        error: "Class not found",
        message: `Class with ID ${id} does not exist`,
      });
    }

    res.json({
      message: "Class retrieved successfully",
      class: classItem,
    });
  } catch (error) {
    console.error("Error retrieving class:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve class",
    });
  }
}
