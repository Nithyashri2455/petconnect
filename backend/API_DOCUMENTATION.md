# PawConnect API Documentation

Complete reference for all API endpoints in the PawConnect backend.

**Base URL:** `http://localhost:5000/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Services](#services)
3. [Events](#events)
4. [Bookings](#bookings)
5. [Users](#users)
6. [Payments](#payments)
7. [System](#system)

---

## Authentication

### 🔓 Register User

**POST** `/auth/register`

Register a new user account.

**Authentication:** None required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "isPremium": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

### 🔓 Login User

**POST** `/auth/login`

Authenticate and get access token.

**Authentication:** None required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "isPremium": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 🔒 Get Current User

**GET** `/auth/me`

Get authenticated user's information.

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isPremium": false,
    "createdAt": "2026-02-05T10:30:00.000Z"
  }
}
```

---

## Services

### 🔓 Get All Services

**GET** `/services`

Retrieve all pet services with optional filtering.

**Authentication:** Optional (premium status affects results)

**Query Parameters:**
- `search` (string): Search by name, type, or location
- `petType` (string): Filter by pet type (Dog, Cat, Bird, All)
- `type` (string): Filter by service type (Grooming, Veterinary, Training, Boarding, Walking)
- `minRating` (number): Minimum rating filter

**Example Request:**
```
GET /api/services?petType=Dog&search=grooming&minRating=4.5
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Happy Tails Grooming",
      "type": "Grooming",
      "rating": 4.8,
      "reviews": 124,
      "location": "Downtown, NY",
      "lat": 40.7128,
      "lng": -74.0060,
      "priceRange": "$$",
      "basePrice": 45.00,
      "verified": true,
      "petTypes": ["Dog", "Cat"],
      "image": "https://...",
      "description": "Professional grooming services for your beloved pets"
    }
  ]
}
```

---

### 🔓 Get Service by ID

**GET** `/services/:id`

Get detailed information about a specific service.

**Authentication:** Optional

**Path Parameters:**
- `id` (integer): Service ID

**Example Request:**
```
GET /api/services/1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Happy Tails Grooming",
    "type": "Grooming",
    "rating": 4.8,
    "reviews": 124,
    "location": "Downtown, NY",
    "lat": 40.7128,
    "lng": -74.0060,
    "priceRange": "$$",
    "basePrice": 45.00,
    "verified": true,
    "petTypes": ["Dog", "Cat"],
    "image": "https://...",
    "description": "Professional grooming services for your beloved pets"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Service not found"
}
```

---

### 🔒 Create Service

**POST** `/services`

Create a new service (Admin only).

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Pet Spa Deluxe",
  "type": "Grooming",
  "location": "Manhattan, NY",
  "latitude": 40.7589,
  "longitude": -73.9851,
  "priceRange": "$$$",
  "basePrice": 95.00,
  "petTypes": ["Dog", "Cat"],
  "imageUrl": "https://...",
  "description": "Luxury spa experience for your pets"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "id": 6
  }
}
```

---

## Events

### 🔓 Get All Events

**GET** `/events`

Retrieve all events. Premium-only events are filtered for non-premium users.

**Authentication:** Optional (affects premium event visibility)

**Query Parameters:**
- `premiumOnly` (boolean): Filter by premium status

**Example Request:**
```
GET /api/events?premiumOnly=false
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 101,
      "title": "Annual Adoption Fair",
      "date": "2026-10-15",
      "location": "Central Park",
      "premiumOnly": false,
      "image": "https://...",
      "description": "Find your perfect furry companion"
    }
  ]
}
```

---

### 🔓 Get Event by ID

**GET** `/events/:id`

Get detailed information about a specific event.

**Authentication:** Optional (premium events require premium membership)

**Path Parameters:**
- `id` (integer): Event ID

**Example Request:**
```
GET /api/events/101
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "title": "Annual Adoption Fair",
    "date": "2026-10-15",
    "location": "Central Park",
    "premiumOnly": false,
    "image": "https://...",
    "description": "Find your perfect furry companion"
  }
}
```

**Error Response (403) - Premium Event:**
```json
{
  "success": false,
  "message": "This event is only available for premium members"
}
```

---

### 🔒 Create Event

**POST** `/events`

Create a new event (Admin only).

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Dog Training Workshop",
  "date": "2026-12-01",
  "location": "Brooklyn Community Center",
  "premiumOnly": false,
  "imageUrl": "https://...",
  "description": "Learn essential training techniques"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 105
  }
}
```

---

## Bookings

**Note:** All booking endpoints require authentication AND premium membership.

### 🔒👑 Create Booking

**POST** `/bookings`

Create a new service booking.

**Authentication:** Required + Premium membership

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "serviceId": 1,
  "bookingDate": "2026-03-15",
  "bookingTime": "10:00",
  "notes": "First time visit"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 9,
    "serviceId": 1,
    "serviceName": "Happy Tails Grooming",
    "serviceType": "Grooming",
    "serviceLocation": "Downtown, NY",
    "serviceImage": "https://...",
    "bookingDate": "2026-03-15",
    "bookingTime": "10:00:00",
    "totalPrice": 45.00,
    "status": "confirmed",
    "notes": "First time visit",
    "createdAt": "2026-02-05T12:00:00.000Z"
  }
}
```

**Validation:**
- `serviceId`: Required, must be a valid service ID
- `bookingDate`: Required, valid date format (YYYY-MM-DD)
- `bookingTime`: Required, valid time format (HH:MM)
- `notes`: Optional

**Error Response (403) - Not Premium:**
```json
{
  "success": false,
  "message": "This feature requires a premium membership."
}
```

---

### 🔒 Get User Bookings

**GET** `/bookings`

Retrieve all bookings for the authenticated user.

**Authentication:** Required

**Query Parameters:**
- `status` (string): Filter by status (pending, confirmed, completed, cancelled)

**Example Request:**
```
GET /api/bookings?status=confirmed
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "serviceId": 1,
      "serviceName": "Happy Tails Grooming",
      "serviceType": "Grooming",
      "serviceLocation": "Downtown, NY",
      "serviceImage": "https://...",
      "bookingDate": "2026-02-10",
      "bookingTime": "10:00:00",
      "totalPrice": 45.00,
      "status": "confirmed",
      "notes": "First grooming appointment",
      "createdAt": "2026-02-01T08:00:00.000Z"
    }
  ]
}
```

---

### 🔒 Get Booking by ID

**GET** `/bookings/:id`

Get detailed information about a specific booking.

**Authentication:** Required

**Path Parameters:**
- `id` (integer): Booking ID

**Example Request:**
```
GET /api/bookings/1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serviceId": 1,
    "serviceName": "Happy Tails Grooming",
    "serviceType": "Grooming",
    "serviceLocation": "Downtown, NY",
    "serviceImage": "https://...",
    "bookingDate": "2026-02-10",
    "bookingTime": "10:00:00",
    "totalPrice": 45.00,
    "status": "confirmed",
    "notes": "First grooming appointment",
    "createdAt": "2026-02-01T08:00:00.000Z"
  }
}
```

---

### 🔒 Cancel Booking

**PATCH** `/bookings/:id/cancel`

Cancel a booking.

**Authentication:** Required

**Path Parameters:**
- `id` (integer): Booking ID

**Example Request:**
```
PATCH /api/bookings/1/cancel
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

**Error Responses:**

Already Cancelled (400):
```json
{
  "success": false,
  "message": "Booking is already cancelled"
}
```

Already Completed (400):
```json
{
  "success": false,
  "message": "Cannot cancel completed booking"
}
```

---

## Users

**Note:** All user endpoints require authentication.

### 🔒 Get User Profile

**GET** `/users/profile`

Get the authenticated user's profile information.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isPremium": true,
    "memberSince": "2026-01-15T10:30:00.000Z"
  }
}
```

---

### 🔒 Update User Profile

**PATCH** `/users/profile`

Update user profile information.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Note:** You can update name, email, or both.

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "isPremium": true
  }
}
```

**Error Response (400) - Email Taken:**
```json
{
  "success": false,
  "message": "Email is already taken"
}
```

---

### 🔒 Change Password

**PATCH** `/users/change-password`

Change user password.

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 🔒 Upgrade to Premium

**POST** `/users/upgrade-premium`

Upgrade user account to premium membership.

**Authentication:** Required

**Request Body:** None

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully upgraded to premium membership"
}
```

**Error Response (400) - Already Premium:**
```json
{
  "success": false,
  "message": "User is already a premium member"
}
```

---

## Payments

**Note:** All payment endpoints require authentication.

### 🔒 Process Payment

**POST** `/payments/process`

Process a payment for a booking or premium upgrade.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "bookingId": 1,
  "amount": 45.00,
  "paymentType": "booking",
  "paymentMethod": "card"
}
```

**Payment Types:**
- `booking`: Payment for a service booking
- `premium_upgrade`: Payment for premium membership upgrade

**Response (201):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "paymentId": 12,
    "transactionId": "TXN1707145200012",
    "amount": 45.00,
    "status": "completed"
  }
}
```

**For Premium Upgrade:**
```json
{
  "amount": 49.99,
  "paymentType": "premium_upgrade",
  "paymentMethod": "card"
}
```

---

### 🔒 Get Payment History

**GET** `/payments/history`

Retrieve payment history for the authenticated user.

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "bookingId": 1,
      "serviceName": "Happy Tails Grooming",
      "bookingDate": "2026-02-10",
      "bookingTime": "10:00:00",
      "amount": 45.00,
      "paymentType": "booking",
      "paymentMethod": "card",
      "transactionId": "TXN1707145200001",
      "status": "completed",
      "createdAt": "2026-02-01T08:00:00.000Z"
    },
    {
      "id": 7,
      "bookingId": null,
      "serviceName": null,
      "bookingDate": null,
      "bookingTime": null,
      "amount": 49.99,
      "paymentType": "premium_upgrade",
      "paymentMethod": "card",
      "transactionId": "TXN1707145200007",
      "status": "completed",
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 🔒 Get Payment by ID

**GET** `/payments/:id`

Get detailed information about a specific payment.

**Authentication:** Required

**Path Parameters:**
- `id` (integer): Payment ID

**Example Request:**
```
GET /api/payments/1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookingId": 1,
    "serviceName": "Happy Tails Grooming",
    "bookingDate": "2026-02-10",
    "bookingTime": "10:00:00",
    "amount": 45.00,
    "paymentType": "booking",
    "paymentMethod": "card",
    "transactionId": "TXN1707145200001",
    "status": "completed",
    "createdAt": "2026-02-01T08:00:00.000Z"
  }
}
```

---

## System

### 🔓 Health Check

**GET** `/health`

Check if the API server is running.

**Authentication:** None required

**Response (200):**
```json
{
  "status": "OK",
  "message": "PawConnect API is running",
  "timestamp": "2026-02-05T15:30:00.000Z"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "This feature requires a premium membership."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development mode)"
}
```

---

## Authentication Guide

### Getting a Token

1. Register or login to get a JWT token
2. Store the token securely (localStorage, sessionStorage, etc.)
3. Include the token in the Authorization header for protected routes

### Using the Token

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**JavaScript Example:**
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/bookings', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### Token Expiration

- Tokens expire after 7 days
- Expired tokens return a 401 error with message: "Token has expired. Please login again."
- Users must re-authenticate to get a new token

---

## Premium Features

The following features require premium membership:

- ✅ Creating bookings
- ✅ Accessing map features (frontend)
- ✅ Viewing premium-only events
- ✅ Processing payments for bookings

To check if a user is premium:
- The `isPremium` field in the user object indicates premium status
- Premium routes return 403 error for non-premium users

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

---

## CORS Configuration

The API allows cross-origin requests from all origins. In production, configure CORS to allow only your frontend domain.

---

## Database Schema Quick Reference

### Users
- `id`, `name`, `email`, `password`, `is_premium`, `created_at`, `updated_at`

### Services
- `id`, `name`, `type`, `rating`, `reviews`, `location`, `latitude`, `longitude`, `price_range`, `base_price`, `verified`, `pet_types` (JSON), `image_url`, `description`

### Events
- `id`, `title`, `date`, `location`, `premium_only`, `image_url`, `description`

### Bookings
- `id`, `user_id`, `service_id`, `booking_date`, `booking_time`, `status`, `total_price`, `notes`, `created_at`, `updated_at`

### Payments
- `id`, `user_id`, `booking_id`, `amount`, `payment_type`, `payment_method`, `transaction_id`, `status`, `created_at`

---

## Testing the API

### Using PowerShell

```powershell
# Login
$body = @{
    email = "alex@pawpremium.com"
    password = "premium123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$token = ($response.Content | ConvertFrom-Json).data.token

# Get services
Invoke-WebRequest -Uri "http://localhost:5000/api/services" -UseBasicParsing | Select-Object -ExpandProperty Content

# Get bookings (with auth)
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-WebRequest -Uri "http://localhost:5000/api/bookings" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@pawpremium.com","password":"premium123"}'

# Get services
curl http://localhost:5000/api/services

# Create booking (with auth)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"serviceId":1,"bookingDate":"2026-03-15","bookingTime":"10:00"}'
```

---

## Quick Reference Table

| Endpoint | Method | Auth | Premium | Description |
|----------|--------|------|---------|-------------|
| `/auth/register` | POST | ❌ | ❌ | Register new user |
| `/auth/login` | POST | ❌ | ❌ | Login user |
| `/auth/me` | GET | ✅ | ❌ | Get current user |
| `/services` | GET | 🔵 | ❌ | Get all services |
| `/services/:id` | GET | 🔵 | ❌ | Get service by ID |
| `/services` | POST | ✅ | ❌ | Create service (admin) |
| `/events` | GET | 🔵 | ❌ | Get all events |
| `/events/:id` | GET | 🔵 | ❌ | Get event by ID |
| `/events` | POST | ✅ | ❌ | Create event (admin) |
| `/bookings` | POST | ✅ | ✅ | Create booking |
| `/bookings` | GET | ✅ | ❌ | Get user bookings |
| `/bookings/:id` | GET | ✅ | ❌ | Get booking by ID |
| `/bookings/:id/cancel` | PATCH | ✅ | ❌ | Cancel booking |
| `/users/profile` | GET | ✅ | ❌ | Get user profile |
| `/users/profile` | PATCH | ✅ | ❌ | Update profile |
| `/users/change-password` | PATCH | ✅ | ❌ | Change password |
| `/users/upgrade-premium` | POST | ✅ | ❌ | Upgrade to premium |
| `/payments/process` | POST | ✅ | ❌ | Process payment |
| `/payments/history` | GET | ✅ | ❌ | Get payment history |
| `/payments/:id` | GET | ✅ | ❌ | Get payment by ID |
| `/health` | GET | ❌ | ❌ | Health check |

**Legend:**
- ✅ Required
- ❌ Not required
- 🔵 Optional (affects results)

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0  
**Server:** http://localhost:5000
