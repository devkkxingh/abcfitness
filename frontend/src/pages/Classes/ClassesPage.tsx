import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useClasses } from "../../hooks/useClasses";
import { Class } from "../../types";

const ClassesPage: React.FC = () => {
  const { data: classes = [], isLoading, error, refetch } = useClasses();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getAvailableSlots = (classItem: Class) => {
    const totalSlots = classItem.instances.length * classItem.capacity;
    const bookedSlots = classItem.instances.reduce(
      (sum, instance) => sum + instance.bookings.length,
      0
    );
    return totalSlots - bookedSlots;
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
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">
              {error instanceof Error
                ? error.message
                : "Failed to load classes"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 btn btn-danger text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
        <Link to="/create-class" className="btn btn-primary">
          Create New Class
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No classes found</div>
          <Link to="/create-class" className="btn btn-primary">
            Create Your First Class
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <div key={classItem.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {classItem.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {classItem.instances.length} sessions
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-900">
                    {classItem.duration} minutes
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time:</span>
                  <span className="text-gray-900">{classItem.startTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity:</span>
                  <span className="text-gray-900">
                    {classItem.capacity} people
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available:</span>
                  <span className="text-green-600 font-medium">
                    {getAvailableSlots(classItem)} slots
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>From: {formatDate(classItem.startDate)}</span>
                  <span>To: {formatDate(classItem.endDate)}</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/classes/${classItem.id}`}
                    className="btn btn-secondary flex-1 text-center text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/book-class/${classItem.id}`}
                    className="btn btn-primary flex-1 text-center text-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
