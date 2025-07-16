import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "../services/api";
import { CreateBookingRequest, SearchBookingsParams } from "../types";

// Query keys
export const bookingsKeys = {
  all: ["bookings"] as const,
  search: (params: SearchBookingsParams) =>
    ["bookings", "search", params] as const,
};

// Get all bookings
export const useBookings = () => {
  return useQuery({
    queryKey: bookingsKeys.all,
    queryFn: bookingsApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes (bookings change more frequently)
  });
};

// Search bookings
export const useSearchBookings = (params: SearchBookingsParams) => {
  return useQuery({
    queryKey: bookingsKeys.search(params),
    queryFn: () => bookingsApi.search(params),
    enabled: !!(params.memberName || params.startDate || params.endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create booking mutation
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: (newBooking) => {
      // Invalidate bookings queries
      queryClient.invalidateQueries({ queryKey: bookingsKeys.all });

      // Also invalidate classes queries since booking affects availability
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
