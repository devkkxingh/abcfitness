import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useBookings, useSearchBookings } from "../../hooks/useBookings";
import { SearchBookingsParams } from "../../types";

const BookingsPage: React.FC = () => {
  const [searchMode, setSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchBookingsParams>({});

  const {
    data: allBookingsData,
    isLoading: isLoadingAll,
    error: allBookingsError,
  } = useBookings();
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useSearchBookings(searchParams);

  const { register, handleSubmit, reset } = useForm<SearchBookingsParams>();

  const onSearch = (data: SearchBookingsParams) => {
    setSearchParams(data);
    setSearchMode(true);
  };

  const clearSearch = () => {
    reset();
    setSearchParams({});
    setSearchMode(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Determine which data to show
  const bookings = searchMode
    ? searchData?.bookings || []
    : allBookingsData?.bookings || [];
  const isLoading = searchMode ? isLoadingSearch : isLoadingAll;
  const error = searchMode ? searchError : allBookingsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <div className="text-sm text-gray-500">
          {searchMode
            ? `${bookings.length} results found`
            : `${bookings.length} total bookings`}
        </div>
      </div>

      {/* Search Form */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Search Bookings
        </h2>

        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Member Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Name
              </label>
              <input
                {...register("memberName")}
                type="text"
                className="input"
                placeholder="Search by member name..."
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input {...register("startDate")} type="date" className="input" />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input {...register("endDate")} type="date" className="input" />
            </div>
          </div>

          {/* Search Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={clearSearch}
              className="btn btn-secondary"
            >
              Clear
            </button>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-sm text-red-800">
            {error instanceof Error ? error.message : "Failed to load bookings"}
          </div>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchMode
              ? "No bookings found for your search"
              : "No bookings found"}
          </div>
          {searchMode && (
            <button onClick={clearSearch} className="btn btn-secondary">
              View All Bookings
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.memberName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.className}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.participationDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.classStartTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.classDuration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.classCapacity}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
