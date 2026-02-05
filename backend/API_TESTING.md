# API Testing Guide

## Quick Start

The backend server is running on: `http://localhost:5000`

## Test with PowerShell

### 1. Health Check
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 2. Register a User
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 3. Login
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$response.Content

# Save the token from the response
$token = ($response.Content | ConvertFrom-Json).data.token
```

### 4. Get All Services (No Auth Required)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/services" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 5. Search Services by Pet Type
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/services?petType=Dog&search=grooming" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 6. Get User Profile (Requires Auth)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 7. Upgrade to Premium
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:5000/api/users/upgrade-premium" -Method POST -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 8. Create a Booking (Premium Required)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    serviceId = 1
    bookingDate = "2026-03-15"
    bookingTime = "10:00"
    notes = "First time visit"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/bookings" -Method POST -Headers $headers -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 9. Get User Bookings
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:5000/api/bookings" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 10. Get All Events
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/events" -UseBasicParsing | Select-Object -ExpandProperty Content
```

## Test with cURL (if installed)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

### Get Services
```bash
curl http://localhost:5000/api/services
```

## Available Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (auth required)

### Services
- GET `/api/services` - Get all services
- GET `/api/services?search=grooming` - Search services
- GET `/api/services?petType=Dog` - Filter by pet type
- GET `/api/services/:id` - Get service by ID

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get event by ID

### Bookings (Premium Required)
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get user bookings
- GET `/api/bookings/:id` - Get booking by ID
- PATCH `/api/bookings/:id/cancel` - Cancel booking

### Users (Auth Required)
- GET `/api/users/profile` - Get user profile
- PATCH `/api/users/profile` - Update profile
- PATCH `/api/users/change-password` - Change password
- POST `/api/users/upgrade-premium` - Upgrade to premium

### Payments (Auth Required)
- POST `/api/payments/process` - Process payment
- GET `/api/payments/history` - Get payment history
- GET `/api/payments/:id` - Get payment by ID

## Sample Data in Database

### Services
- Happy Tails Grooming (id: 1) - $45
- City Vet Hospital (id: 2) - $120
- Paws & Play Training (id: 3) - $65
- Pet Paradise Boarding (id: 4) - $85
- Walk & Wag (id: 5) - $30

### Events
- Annual Adoption Fair (id: 101) - Free event
- Golden Retriever Meetup (id: 102) - Premium only
- Pet Health Workshop (id: 103) - Free event
- Premium Members Gala (id: 104) - Premium only
