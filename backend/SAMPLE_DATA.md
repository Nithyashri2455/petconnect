# Sample Data Reference

## 📊 Database Contents

### 👥 Users (5 total)
| ID | Name | Email | Type | Password |
|----|------|-------|------|----------|
| 1 | Alex Johnson | alex@pawpremium.com | Premium | premium123 |
| 2 | Sam Taylor | sam@petlover.com | Free | free123 |
| 3 | Emma Davis | emma@premium.com | Premium | premium123 |
| 4 | Mike Wilson | mike@user.com | Free | free123 |
| 5 | Sarah Brown | sarah@premium.com | Premium | premium123 |

### 🏢 Services (5 total)
| ID | Name | Type | Price | Pet Types | Location |
|----|------|------|-------|-----------|----------|
| 1 | Happy Tails Grooming | Grooming | $45 | Dog, Cat | Downtown, NY |
| 2 | City Vet Hospital | Veterinary | $120 | Dog, Cat, Bird | Brooklyn, NY |
| 3 | Paws & Play Training | Training | $65 | Dog | Queens, NY |
| 4 | Pet Paradise Boarding | Boarding | $85 | Dog, Cat | Manhattan, NY |
| 5 | Walk & Wag | Walking | $30 | Dog | Bronx, NY |

### 📅 Events (4 total)
| ID | Title | Date | Premium Only |
|----|-------|------|--------------|
| 101 | Annual Adoption Fair | Oct 15, 2026 | No |
| 102 | Golden Retriever Meetup | Oct 20, 2026 | Yes |
| 103 | Pet Health Workshop | Nov 5, 2026 | No |
| 104 | Premium Members Gala | Nov 12, 2026 | Yes |

### 📋 Bookings (8 total)
All bookings are for premium users (IDs: 1, 3, 5)
- **User 1 (Alex)**: 3 bookings
  - Grooming on Feb 10 - Confirmed
  - Vet checkup on Feb 12 - Confirmed
  - Training on Jan 25 - Completed
- **User 3 (Emma)**: 3 bookings
  - Training on Feb 15 - Confirmed
  - Boarding on Feb 20 - Pending
  - Vet visit on Jan 28 - Completed
- **User 5 (Sarah)**: 2 bookings
  - Walking on Feb 8 - Completed
  - Grooming on Feb 18 - Confirmed

### 💳 Payments (11 total)
- 8 booking payments (ranging from $30 to $120)
- 3 premium upgrade payments ($49.99 each)
- Mix of completed and pending statuses

## 🧪 Quick Test Commands

### Login as Premium User
```powershell
$body = @{
    email = "alex@pawpremium.com"
    password = "premium123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Login as Free User
```powershell
$body = @{
    email = "sam@petlover.com"
    password = "free123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Get All Services
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/services" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Get Bookings (Premium user required)
```powershell
# First login to get token
$loginBody = @{
    email = "alex@pawpremium.com"
    password = "premium123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
$token = ($loginResponse.Content | ConvertFrom-Json).data.token

# Then get bookings
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-WebRequest -Uri "http://localhost:5000/api/bookings" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Get Payment History (Premium user required)
```powershell
# Use token from login above
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-WebRequest -Uri "http://localhost:5000/api/payments/history" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content
```

## 📌 Notes

- All premium users can access booking and payment features
- Free users can only browse services and events
- Passwords are properly hashed with bcrypt in the database
- All relationships (foreign keys) are properly maintained
- Sample data includes past, current, and future bookings
