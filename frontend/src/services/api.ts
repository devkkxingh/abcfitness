import axios from "axios";
import {
  Class,
  CreateClassRequest,
  CreateBookingRequest,
  SearchBookingsParams,
  ClassesResponse,
  BookingsResponse,
  Booking,
} from "../types";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health check
export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

// Classes API
export const classesApi = {
  // Get all classes
  getAll: async (): Promise<Class[]> => {
    const response = await api.get<ClassesResponse>("/classes");
    return response.data.classes;
  },

  // Get class by ID
  getById: async (id: string): Promise<Class> => {
    const response = await api.get<{ message: string; class: Class }>(
      `/classes/${id}`
    );
    return response.data.class;
  },

  // Create a new class
  create: async (classData: CreateClassRequest): Promise<Class> => {
    const response = await api.post<{ message: string; class: Class }>(
      "/classes",
      classData
    );
    return response.data.class;
  },
};

// Bookings API
export const bookingsApi = {
  // Get all bookings
  getAll: async () => {
    const response = await api.get<BookingsResponse>("/bookings/all");
    return response.data;
  },

  // Search bookings
  search: async (params: SearchBookingsParams) => {
    const response = await api.get<BookingsResponse>("/bookings", { params });
    return response.data;
  },

  // Create a new booking
  create: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post<{ message: string; booking: Booking }>(
      "/bookings",
      bookingData
    );
    return response.data.booking;
  },
};

export default api;
