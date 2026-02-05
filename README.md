# PawConnect 🐾

**Connecting hearts and paws.**

PawConnect is a full-stack pet services platform that connects pet owners with verified professional pet service providers in their neighborhood. The application enables users to discover services, book appointments, attend community events, and manage their pet care needs all in one place.

## Features

### 🔍 Discover Services
Find verified professionals in your neighborhood for:
- Dog grooming
- Veterinary services
- Pet training
- And more pet care services

Users can search, filter, and view detailed profiles of service providers with ratings and reviews.

![Discover Page](public/images/Screenshot%202026-02-05%20231947.png)

### 📅 Community Events
Stay updated with local pet community events:
- Adoption fairs
- Pet meetups
- Training workshops
- Community gatherings

RSVP to events and connect with other pet owners.

![Events Page](public/images/Screenshot%202026-02-05%20232008.png)

### 📝 Appointments Management
Easily manage your appointments:
- Book services from providers
- Track upcoming appointments
- View appointment history
- Manage bookings efficiently

### 👤 User Profile
Manage your account with:
- Premium membership options
- Profile customization
- Appointment history
- Payment methods
- Preferences

![Profile Page](public/images/Screenshot%202026-02-05%20232019.png)

### 🔐 Authentication
Secure authentication with:
- Email and password login
- Account registration
- Google OAuth integration
- Password recovery options

![Register Screen](public/images/Screenshot%202026-02-05%20232036.png)

## More Screenshots

![Sign In Screen](public/images/Screenshot%202026-02-05%20232050.png)

![Checkout Modal](public/images/Screenshot%202026-02-05%20232132.png)

## Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite/PostgreSQL** - Database
- **JWT** - Authentication tokens

### Development
- **VS Code** - Code editor
- **Git** - Version control

## Project Structure

```
pet-app-trial-nit/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Appointments/
│   │   │   ├── Discover/
│   │   │   ├── Events/
│   │   │   └── Profile/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nithyashri2455/petconnect.git
cd petconnect
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create environment configuration files:
```bash
# In root directory
cp .env.example .env

# In backend directory
cp .env.example .env
```

### Running the Application

**Frontend (from root directory):**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

**Backend (from backend directory):**
```bash
npm start
# or for development with auto-reload
npm run dev
```
The backend will run on `http://localhost:5000`

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm preview` - Preview production build

### Backend Scripts
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)

## API Documentation

See [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for detailed API endpoints.

## Database Schema

See [SAMPLE_DATA.md](./backend/SAMPLE_DATA.md) for database structure and sample data.

## Google OAuth Setup

For OAuth integration, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

## Audit and Compliance

See [COMPLETE_AUDIT_REPORT.md](./COMPLETE_AUDIT_REPORT.md) for security and code audit reports.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please reach out to the development team.

---

Made with ❤️ for pet lovers everywhere
