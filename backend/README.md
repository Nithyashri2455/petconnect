# PawConnect Backend API

Complete Node.js backend for the PawConnect pet services platform with MySQL database.

## Features

- 🔐 **Authentication**: JWT-based auth with bcrypt password hashing
- 👤 **User Management**: Registration, login, profile management, premium upgrades
- 🐕 **Services**: Browse pet services (grooming, veterinary, training, etc.)
- 📅 **Events**: View and manage pet-related events
- 📝 **Bookings**: Create and manage service appointments
- 💳 **Payments**: Process payments and track transaction history
- 🔍 **Search & Filter**: Advanced filtering by pet type, service type, location
- ⭐ **Premium Features**: Premium-only access to maps and booking features

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware

## Prerequisites

- Node.js 16+ installed
- MySQL 8+ installed and running
- MySQL root password: `129141` (or update in `.env`)

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
The `.env` file is already set up with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=129141
DB_NAME=pet_app
```

4. Initialize database:
```bash
npm run init-db
```

This creates:
- Database `pet_app`
- All required tables (users, services, events, bookings, payments)
- Sample data for services and events

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Services
- `GET /api/services` - Get all services (with filters)
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin)

### Bookings
- `POST /api/bookings` - Create booking (premium only)
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PATCH /api/users/profile` - Update profile (protected)
- `PATCH /api/users/change-password` - Change password (protected)
- `POST /api/users/upgrade-premium` - Upgrade to premium (protected)

### Payments
- `POST /api/payments/process` - Process payment (protected)
- `GET /api/payments/history` - Get payment history (protected)
- `GET /api/payments/:id` - Get payment by ID (protected)

### Health Check
- `GET /api/health` - Server health check

## Database Schema

### users
- id, name, email, password, is_premium, created_at, updated_at

### services
- id, name, type, rating, reviews, location, latitude, longitude, price_range, base_price, verified, pet_types (JSON), image_url, description

### events
- id, title, date, location, premium_only, image_url, description

### bookings
- id, user_id, service_id, booking_date, booking_time, status, total_price, notes

### payments
- id, user_id, booking_id, amount, payment_type, payment_method, transaction_id, status

## Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Token is returned from `/api/auth/login` and `/api/auth/register`

## Sample API Calls

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Services
```bash
curl http://localhost:5000/api/services?petType=Dog&search=grooming
```

### Create Booking (requires auth)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"serviceId":1,"bookingDate":"2026-03-15","bookingTime":"10:00"}'
```

## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // validation errors if applicable
}
```

## Development

- Uses ES6 modules (`type: "module"`)
- Async/await for all database operations
- Connection pooling for optimal performance
- Request logging middleware
- Global error handler

## Troubleshooting

**Database connection failed:**
- Ensure MySQL is running
- Check credentials in `.env file`
- Verify MySQL port (default: 3306)

**Database not found:**
- Run `npm run init-db` to create database

**Permission denied:**
- Check MySQL user permissions
- Ensure root user has proper access rights

## License

ISC
