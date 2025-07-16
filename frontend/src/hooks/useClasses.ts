import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesApi } from "../services/api";
import { CreateClassRequest } from "../types";

// Query keys
export const classesKeys = {
  all: ["classes"] as const,
  detail: (id: string) => ["classes", id] as const,
};

// Get all classes
export const useClasses = () => {
  return useQuery({
    queryKey: classesKeys.all,
    queryFn: classesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get class by ID
export const useClass = (id: string) => {
  return useQuery({
    queryKey: classesKeys.detail(id),
    queryFn: () => classesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create class mutation
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassRequest) => classesApi.create(data),
    onSuccess: (newClass) => {
      // Invalidate and refetch classes list
      queryClient.invalidateQueries({ queryKey: classesKeys.all });

      // Optionally add the new class to the cache
      queryClient.setQueryData(classesKeys.detail(newClass.id), newClass);
    },
  });
};
