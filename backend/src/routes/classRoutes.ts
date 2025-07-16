import { Router } from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
} from "../controllers/classController";

const router = Router();

// POST /api/classes - Create a new class
router.post("/", createClass);

// GET /api/classes - Get all classes
router.get("/", getAllClasses);

// GET /api/classes/:id - Get a specific class by ID
router.get("/:id", getClassById);

export default router;
