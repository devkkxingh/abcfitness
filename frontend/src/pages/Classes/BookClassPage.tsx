import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useClass } from "../../hooks/useClasses";
import { useCreateBooking } from "../../hooks/useBookings";
import { CreateBookingRequest } from "../../types";
import { bookClassSchema, BookClassFormData } from "../../validationSchemas";

const BookClassPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState<string | null>(null);

  const { data: classDetails, isLoading, error } = useClass(classId!);
  const createBookingMutation = useCreateBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookClassFormData>({
    resolver: zodResolver(bookClassSchema),
  });

  const onSubmit = async (data: BookClassFormData) => {
    if (!classId || !classDetails) return;

    // Clear previous errors
    setFormError(null);

    // Additional validation: Check if participation date is in the future
    const participationDate = new Date(data.participationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    if (participationDate < today) {
      setFormError("Participation date must be in the future");
      return;
    }

    // Additional validation: Check if participation date is within class date range
    const classStartDate = new Date(classDetails.startDate);
    const classEndDate = new Date(classDetails.endDate);

    if (
      participationDate < classStartDate ||
      participationDate > classEndDate
    ) {
      setFormError("Selected date must be within the class date range");
      return;
    }

    // Check if the selected date has available slots
    const availableSlots = getAvailableSlots(data.participationDate);
    if (availableSlots <= 0) {
      setFormError("Selected date is full. Please choose a different date.");
      return;
    }

    const bookingData: CreateBookingRequest = {
      memberName: data.memberName,
      classId: classId,
      participationDate: data.participationDate,
    };

    createBookingMutation.mutate(bookingData, {
      onSuccess: () => {
        navigate("/bookings");
      },
    });
  };

  const getAvailableSlots = (date: string) => {
    if (!classDetails) return 0;

    const instance = classDetails.instances.find(
      (inst) => format(new Date(inst.date), "yyyy-MM-dd") === date
    );

    return instance
      ? classDetails.capacity - instance.bookings.length
      : classDetails.capacity;
  };

  const getAvailableDates = () => {
    if (!classDetails) return [];
    debugger;

    const classStartDate = new Date(classDetails.startDate);
    const classEndDate = new Date(classDetails.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    return classDetails.instances
      .map((instance) => {
        const instanceDate = new Date(instance.date);
        const date = format(instanceDate, "yyyy-MM-dd");
        const availableSlots = getAvailableSlots(date);
        return {
          date,
          availableSlots,
          displayDate: format(instanceDate, "MMM dd, yyyy"),
          instanceDate,
          isAvailable: availableSlots > 0,
        };
      })
      .filter((dateInfo) => {
        // Filter by class date range and future dates only (show all dates, even if full)
        return (
          dateInfo.instanceDate >= classStartDate &&
          dateInfo.instanceDate <= classEndDate &&
          dateInfo.instanceDate >= today // Only future dates
        );
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-sm text-red-800">
          {error instanceof Error
            ? error.message
            : "Failed to load class details"}
        </div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Class not found</div>
      </div>
    );
  }

  const availableDates = getAvailableDates();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Class</h1>
        <p className="text-gray-600 mt-1">
          Book your spot in {classDetails.name}
        </p>
      </div>

      {/* Class Details */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {classDetails.name}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="ml-2 text-gray-900">
              {classDetails.duration} minutes
            </span>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>
            <span className="ml-2 text-gray-900">{classDetails.startTime}</span>
          </div>
          <div>
            <span className="text-gray-500">Capacity:</span>
            <span className="ml-2 text-gray-900">
              {classDetails.capacity} people
            </span>
          </div>
          <div>
            <span className="text-gray-500">Available Dates:</span>
            <span className="ml-2 text-green-600">
              {availableDates.filter((d) => d.isAvailable).length} of{" "}
              {availableDates.length} sessions
            </span>
          </div>
        </div>
      </div>

      {availableDates.length === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-gray-500 text-lg mb-4">
            No upcoming class sessions found
          </div>
          <p className="text-gray-400 text-sm mb-4">
            This could mean all sessions are in the past, outside the class date
            range, or the class hasn't been scheduled yet.
          </p>
          <button onClick={() => navigate("/")} className="btn btn-secondary">
            Back to Classes
          </button>
        </div>
      ) : (
        <>
          {createBookingMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-sm text-red-800">
                {createBookingMutation.error instanceof Error
                  ? createBookingMutation.error.message
                  : "Failed to create booking"}
              </div>
            </div>
          )}

          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-red-800">{formError}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Member Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  {...register("memberName")}
                  type="text"
                  className={`input ${
                    errors.memberName
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.memberName && (
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
                      {errors.memberName.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Participation Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <select
                  {...register("participationDate")}
                  className={`input ${
                    errors.participationDate
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                >
                  <option value="">Choose a date...</option>
                  {availableDates.map((dateInfo) => (
                    <option
                      key={dateInfo.date}
                      value={dateInfo.date}
                      disabled={!dateInfo.isAvailable}
                    >
                      {dateInfo.displayDate} (
                      {dateInfo.availableSlots > 0
                        ? `${dateInfo.availableSlots} slots available`
                        : "FULL"}
                      )
                    </option>
                  ))}
                </select>
                {errors.participationDate && (
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
                      {errors.participationDate.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Booking Information
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    You can book multiple classes for the same day and time if
                    needed. Each booking is for a single class session.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn btn-secondary"
                disabled={createBookingMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? "Booking..." : "Book Class"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default BookClassPage;
