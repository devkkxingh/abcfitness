import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClass } from "../../hooks/useClasses";
import { format } from "date-fns";

const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { data: classData, isLoading, error } = useClass(classId!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Class Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The class you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Back to Classes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {classData.name}
            </h1>
            <button
              onClick={() => navigate("/")}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              ← Back to Classes
            </button>
          </div>

          {/* Class Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Class Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {classData.duration} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">
                      {classData.capacity} people
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="font-medium">{classData.startTime}</span>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Schedule
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">
                      {format(new Date(classData.startDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">
                      {format(new Date(classData.endDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Instances */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Sessions
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {classData.instances?.map((instance) => {
                  const bookedSpots = instance.bookings?.length || 0;
                  const availableSpots = classData.capacity - bookedSpots;

                  return (
                    <div
                      key={instance.id}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            {format(
                              new Date(instance.date),
                              "EEEE, MMMM d, yyyy"
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            {classData.startTime} • {classData.duration} min
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {availableSpots} spots left
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              availableSpots > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {availableSpots > 0 ? "Available" : "Full"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate(`/book-class/${classData.id}`)}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
            >
              Book This Class
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to All Classes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
