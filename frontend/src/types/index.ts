export interface Class {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  duration: number;
  capacity: number;
  instances: ClassInstance[];
}

export interface ClassInstance {
  id: string;
  date: string;
  classId: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  memberName: string;
  participationDate: string;
  classInstance: {
    id: string;
    date: string;
    class: {
      id: string;
      name: string;
      startTime: string;
      duration: number;
      capacity: number;
    };
  };
}

export interface FormattedBooking {
  id: string;
  memberName: string;
  participationDate: string;
  className: string;
  classStartTime: string;
  classDuration: number;
  classCapacity: number;
}

export interface CreateClassRequest {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  duration: number;
  capacity: number;
}

export interface CreateBookingRequest {
  memberName: string;
  classId: string;
  participationDate: string;
}

export interface SearchBookingsParams {
  memberName?: string;
  startDate?: string;
  endDate?: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
  details?: any[];
}

export interface ClassesResponse {
  message: string;
  classes: Class[];
}

export interface BookingsResponse {
  message: string;
  bookings: FormattedBooking[];
  totalFound: number;
}
