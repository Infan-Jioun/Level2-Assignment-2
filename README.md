# Vehicle Rental System API

A fully functional **Vehicle Rental Management Backend** built with Node.js, Express, TypeScript, and PostgreSQL. Supports role-based authentication (Admin & Customer), vehicle management, booking system with automatic price calculation, and real-time availability tracking.

**Live API URL:** `https://vehicle-rental-rho.vercel.app/`  


---

### Features

- **User Authentication & Authorization**
  - Secure registration & login with JWT
  - Role-based access: `Admin` & `Customer`
  - Password hashed with bcrypt

- **Vehicle Management (Admin Only)**
  - Add, update, delete vehicles
  - Real-time availability status (`available` / `booked`)
  - Prevent deletion if vehicle has active bookings

- **Booking System**
  - Customers can book available vehicles
  - Automatic price calculation: `daily_rate × number_of_days`
  - Auto update vehicle status to `booked` on booking
  - Cancel booking (by customer) or mark as returned (by admin)
  - Vehicle becomes `available` again on cancel/return

- **Role-Based Data Access**
  - Admin sees all users & bookings
  - Customer sees only their own bookings

- **Clean & Modular Architecture**
  - Feature-based folder structure
  - Separation of concerns: `routes → controllers → services`

---

### Technology Stack

| Technology       | Purpose                     |
|------------------|-----------------------------|
| Node.js          | Runtime                     |
| Express.js       | Web Framework               |
| TypeScript       | Type Safety & Better DX     |
| PostgreSQL       | Database                    |
| bcrypt           | Password Hashing            |
| jsonwebtoken     | JWT Authentication          |
| pg (node-postgres) | Database Client           |

---

### Project Structure
src/
├── config/          → DB & config
├── middleware/      → auth, isAdmin
├── modules/
│   ├── auth/        → signup, signin
│   ├── users/       → user management
│   ├── vehicles/    → vehicle CRUD
│   └── bookings/    → booking logic
├── app.ts           → Main Express app
└── server.ts        → Entry point
