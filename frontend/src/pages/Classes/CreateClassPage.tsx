import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateClass } from "../../hooks/useClasses";
import { CreateClassRequest } from "../../types";
import {
  createClassSchema,
  CreateClassFormData,
} from "../../validationSchemas";

const CreateClassPage: React.FC = () => {
  const navigate = useNavigate();
  const createClassMutation = useCreateClass();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
  });

  const onSubmit = async (data: CreateClassFormData) => {
    // Data is already validated by Zod, no need for manual conversion
    const classData: CreateClassRequest = {
      ...data,
      duration: data.duration,
      capacity: data.capacity,
    };

    createClassMutation.mutate(classData, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
        <p className="text-gray-600 mt-1">
          Fill in the details below to create a new fitness class
        </p>
      </div>

      {createClassMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-sm text-red-800">
            {createClassMutation.error instanceof Error
              ? createClassMutation.error.message
              : "Failed to create class"}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              {...register("name")}
              type="text"
              className={`input ${
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }`}
              placeholder="e.g., Morning Yoga, Pilates, CrossFit"
            />
            {errors.name && (
              <div className="flex items-center mt-1">
                <svg
                  className="w-4 h-4 text-red-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                {...register("startDate")}
                type="date"
                className={`input ${
                  errors.startDate ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.startDate && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 text-sm">
                    {errors.startDate.message}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                {...register("endDate")}
                type="date"
                className={`input ${
                  errors.endDate ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.endDate && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 text-sm">
                    {errors.endDate.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                {...register("startTime")}
                type="time"
                className={`input ${
                  errors.startTime ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.startTime && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 text-sm">
                    {errors.startTime.message}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                {...register("duration", { valueAsNumber: true })}
                type="number"
                min="1"
                className={`input ${
                  errors.duration ? "border-red-500 focus:border-red-500" : ""
                }`}
                placeholder="e.g., 60"
              />
              {errors.duration && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 text-sm">
                    {errors.duration.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (max participants)
            </label>
            <input
              {...register("capacity", { valueAsNumber: true })}
              type="number"
              min="1"
              className={`input ${
                errors.capacity ? "border-red-500 focus:border-red-500" : ""
              }`}
              placeholder="e.g., 20"
            />
            {errors.capacity && (
              <div className="flex items-center mt-1">
                <svg
                  className="w-4 h-4 text-red-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-600 text-sm">
                  {errors.capacity.message}
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Class Instance Creation
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  One class instance will be created for each day between the
                  start and end dates. For example, a class from Dec 1-5 will
                  create 5 individual class sessions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-secondary"
            disabled={createClassMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createClassMutation.isPending}
          >
            {createClassMutation.isPending ? "Creating..." : "Create Class"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassPage;
