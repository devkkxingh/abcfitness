# ABC Ignite – Fitness Class Management System Assessment

**Assessment Project:** Full-Stack TypeScript Application with React & Express

This project is my submission for the ABC Ignite full-stack assessment. It demonstrates a fitness class management system built with modern web technologies.

## Assessment Overview

This project demonstrates:

- **Full-Stack Development**: Complete frontend and backend implementation
- **RESTful API Design**: Clean, documented API following REST principles
- **TypeScript**: Type-safe development across entire stack
- **Database Management**: SQLite with Prisma ORM and migrations
- **Modern Frontend**: React 18 with TailwindCSS and TanStack Query
- **Business Logic**: Real-world fitness class booking system

## Features

### Backend API Architecture

The backend follows a layered architecture pattern:

**Controllers Layer**

- Handle HTTP requests and responses
- Input validation and error handling
- Business logic orchestration

**Models Layer**

- Business logic implementation
- Database operations
- Data validation and transformation

**Routes Layer**

- API endpoint definitions
- Middleware integration
- Request routing

**Database Layer**

- Prisma ORM for type-safe database access
- Automated migrations
- Relationship management

### API Endpoints

#### Classes Management

- `POST /api/classes` - Create new fitness class
- `GET /api/classes` - Retrieve all classes
- `GET /api/classes/:id` - Get specific class details

#### Bookings Management

- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Search bookings with filters
- `GET /api/bookings/all` - Get all bookings

#### System

- `GET /api/health` - Health check endpoint

### Frontend Application

- **Class Dashboard**: View all available classes with real-time availability
- **Class Creation**: Form-based class creation with validation
- **Booking Interface**: Interactive booking system with date selection
- **Booking Management**: Search and filter existing bookings
- **Responsive Design**: Mobile-first responsive interface

## Technology Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date operations

### Frontend

- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query
- **Routing**: React Router
- **Forms**: React Hook Form with validation

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

## Installation & Setup

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/devkkxingh/abcftness.git
   cd abcfitness
   ```

2. **Install dependencies**:

   ```bash
   npm run install:all
   ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

The application will be available at:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

No authentication required for this assessment.

### Classes API

#### Create a Class

```http
POST /api/classes
Content-Type: application/json

{
  "name": "Yoga",
  "startDate": "2024-12-01",
  "endDate": "2024-12-20",
  "startTime": "09:00",
  "duration": 60,
  "capacity": 15
}
```

**Response:**

```json
{
  "message": "Class created successfully",
  "class": {
    "id": "uuid",
    "name": "Yoga",
    "startDate": "2024-12-01T00:00:00.000Z",
    "endDate": "2024-12-20T00:00:00.000Z",
    "startTime": "09:00",
    "duration": 60,
    "capacity": 15,
    "instances": [...]
  },
  "totalInstances": 20
}
```

#### Get All Classes

```http
GET /api/classes
```

#### Get Class by ID

```http
GET /api/classes/{id}
```

### Bookings API

#### Create a Booking

```http
POST /api/bookings
Content-Type: application/json

{
  "memberName": "John Doe",
  "classId": "class-uuid",
  "participationDate": "2024-12-05"
}
```

**Response:**

```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "uuid",
    "memberName": "John Doe",
    "participationDate": "2024-12-05T00:00:00.000Z",
    "classInstance": {
      "id": "instance-uuid",
      "date": "2024-12-05T00:00:00.000Z",
      "class": {
        "id": "class-uuid",
        "name": "Yoga",
        "startTime": "09:00",
        "duration": 60,
        "capacity": 15
      }
    }
  }
}
```

#### Search Bookings

```http
GET /api/bookings?memberName=John&startDate=2024-12-01&endDate=2024-12-31
```

Query Parameters:

- `memberName` (optional): Filter by member name
- `startDate` (optional): Filter bookings from this date
- `endDate` (optional): Filter bookings until this date

## Database Schema

```sql
-- Class table
CREATE TABLE Class (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  startTime TEXT NOT NULL,
  duration INTEGER NOT NULL,
  capacity INTEGER NOT NULL
);

-- ClassInstance table
CREATE TABLE ClassInstance (
  id TEXT PRIMARY KEY,
  date DATETIME NOT NULL,
  classId TEXT NOT NULL,
  FOREIGN KEY (classId) REFERENCES Class(id)
);

-- Booking table
CREATE TABLE Booking (
  id TEXT PRIMARY KEY,
  memberName TEXT NOT NULL,
  participationDate DATETIME NOT NULL,
  classInstanceId TEXT NOT NULL,
  FOREIGN KEY (classInstanceId) REFERENCES ClassInstance(id)
);
```

## Business Rules

### Class Creation

- Class name is required
- Start and end dates must be in the future
- End date must be after start date
- Capacity must be at least 1
- Duration must be at least 1 minute
- One class instance is created per day between start and end dates

### Booking Rules

- Member name is required
- Class ID must be valid
- Participation date must be in the future
- Participation date must be within class date range
- Booking cannot exceed class capacity
- Members can book multiple classes for the same day/time

## Development Commands

### Root Level

```bash
npm run dev          # Start both backend and frontend
npm run install:all  # Install all dependencies
npm run build        # Build frontend for production
npm start           # Start production backend
```

### Backend

```bash
cd backend
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
```

### Frontend

```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
```

## Project Structure

```
abcfitness/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Main application
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # Business logic
│   │   ├── routes/            # API routes
│   │   └── lib/               # Utilities
│   └── prisma/                # Database schema
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   └── services/         # API services
│   └── public/               # Static assets
└── package.json              # Workspace config
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": []
}
```

## Testing the Application

1. Navigate to http://localhost:3001
2. Create a new class using the form
3. Book a class from the classes list
4. View bookings in the bookings section
5. Test search and filtering functionality

## Common Issues

**Port conflicts**: If ports 3000 or 3001 are busy, stop other processes or change ports in configuration files.

**Database issues**: Delete `backend/prisma/dev.db` and run `npx prisma migrate dev` in the backend directory.

**Dependencies**: Run `npm run install:all` to reinstall all dependencies.

---

**ABC Ignite** - Built with TypeScript, React, Express.js, and Prisma ORM.
