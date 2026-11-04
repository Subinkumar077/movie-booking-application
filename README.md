# ReelReserve - Movie Booking Application

## Project Demo

Watch the project demonstration on [YouTube](https://youtu.be/B8ySNtpaGPQ).

ReelReserve is a full-stack movie ticket booking platform. It combines a Spring Boot REST API with a React/Vite frontend for movie discovery, showtime selection, seat booking, booking history, and administrator management.

## Features

### Customer experience

- Register and sign in with JWT authentication
- Browse movies loaded from the backend
- Search movies by title
- Filter movies by genre and language
- View movie details and available shows
- Select seats using theater capacity and current booking data
- Submit bookings with selected seat numbers
- View booking history
- Filter bookings by status
- Cancel bookings when permitted by the backend
- Responsive cinematic dark-themed UI

### Administrator experience

- Protected admin dashboard
- Movie statistics and show pipeline
- Create, edit, and delete movies
- Create, edit, and delete theaters
- Create, edit, and delete shows
- Filter bookings by status
- Confirm pending bookings
- Cancel bookings where the backend permits it
- Responsive administration layout

## Technology stack

### Backend

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Spring Security
- PostgreSQL
- JSON Web Tokens
- Lombok
- Maven

### Frontend

- React 18
- Vite
- JavaScript (ES modules)
- React Router
- Axios
- Lucide React
- React Hot Toast
- Framer Motion dependency included for future animation work

## Project structure

```text
MoviesBookingApplication/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   └── admin/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── src/
│   └── main/
│       ├── java/com/example/MoviesBookingApplication/
│       └── resources/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── .gitignore
```

## Prerequisites

- Java 21 or newer
- Node.js 18 or newer
- npm
- PostgreSQL
- A PostgreSQL database named `MovieBookingApp`

## Backend setup

Configure the database and JWT settings in:

```text
src/main/resources/application.properties
```

Set the required environment variables before starting the backend:

```powershell
$env:DB_PASSWORD = "your-postgres-password"
$env:JWT_SECRET = "replace-with-a-long-random-secret"
```

Optional variables are `DB_URL`, `DB_USERNAME`, and `JWT_EXPIRATION`. Do not commit real database passwords or production JWT secrets.

Start the backend from the project root:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

Run backend tests:

```powershell
.\mvnw.cmd test
```

## Frontend setup

Create a local environment file:

```powershell
Set-Location frontend
Copy-Item .env.example .env
```

The default frontend API configuration is:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Install dependencies and start Vite:

```powershell
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Build the frontend:

```powershell
npm run build
```

## Test accounts and seed data

The local verification database was seeded with these test accounts:

```text
Admin:
Username: testadmin
Password: use the local seed password

Customer:
Username: testuser
Password: use the local seed password
```

The seed data contains movies, theaters, shows, and bookings. Credentials are intentionally not committed to this repository. These accounts are for local development only and must be replaced before deploying anywhere public.

The admin bootstrap endpoint is available only while no administrator exists:

```http
POST /api/admin/registeradminuser
```

Example request:

```json
{
  "username": "testadmin",
  "email": "testadmin@example.com",
  "password": "<local-admin-password>"
}
```

## Frontend routes

### Public routes

| Route | Purpose |
|---|---|
| `/` | Movie discovery homepage |
| `/login` | Customer/admin login |
| `/register` | Customer registration |
| `/movies/:id` | Movie details and shows |

### Authenticated customer routes

| Route | Purpose |
|---|---|
| `/booking/seats/:showId` | Seat selection |
| `/booking/confirmation/:bookingId` | Booking confirmation |
| `/my-bookings` | Booking history and cancellation |

### Admin routes

| Route | Purpose |
|---|---|
| `/admin/dashboard` | Dashboard overview |
| `/admin/movies` | Movie management |
| `/admin/theaters` | Theater management |
| `/admin/shows` | Show management |
| `/admin/bookings` | Booking management |

## Backend API summary

### Authentication

```text
POST /api/auth/login
POST /api/auth/registernormaluser
POST /api/admin/registeradminuser
```

### Movies

```text
GET    /api/movies/getallmovies
GET    /api/movies/getmoviesbygenre?genre={genre}
GET    /api/movies/getmoviesbylanguage?language={language}
GET    /api/movies/getmoviesbytitle?title={title}
POST   /api/movies/addmovies
PUT    /api/movies/updatemovie/{id}
DELETE /api/movies/deletemovie/{id}
```

### Theaters

```text
GET    /api/theater/getalltheaters
GET    /api/theater/gettheaterbylocation?location={location}
POST   /api/theater/addtheater
PUT    /api/theater/updatetheater/{id}
DELETE /api/theater/deletetheater/{id}
```

### Shows

```text
GET    /api/show/getallshows
GET    /api/show/getshowbymovie/{id}
GET    /api/show/getshowbytheater/{id}
POST   /api/show/createshow
PUT    /api/show/updateshow/{id}
DELETE /api/show/deleteshow/{id}
```

### Bookings

```text
POST /api/booking/createbooking
GET  /api/booking/getuserbooking
GET  /api/booking/getshowbooking/{id}
GET  /api/booking/status/{bookingStatus}
PUT  /api/booking/confirm/{id}
PUT  /api/booking/cancel/{id}
```

## Booking and seat availability notes

The current backend does not expose a dedicated seat-layout or live seat-availability endpoint. The frontend therefore:

1. Derives a provisional seat grid from theater capacity.
2. Reads existing show bookings.
3. Marks seats from non-cancelled bookings as unavailable.
4. Sends selected seat numbers to the backend.
5. Treats the backend response as authoritative for conflicts and final pricing.

The frontend must not be treated as the source of truth for authorization, availability, cancellation eligibility, or pricing.

## Verification workflow

1. Start PostgreSQL.
2. Start the backend.
3. Start the frontend.
4. Log in as `testuser` and verify:
   - Movie browsing
   - Search and filters
   - Movie details
   - Show selection
   - Seat availability
   - Booking creation
   - My bookings
   - Cancellation
5. Log in as `testadmin` and verify:
   - Dashboard
   - Movie CRUD
   - Theater CRUD
   - Show CRUD
   - Booking status filters
   - Confirm/cancel actions

## Generated files and ignored files

The repository ignores generated or machine-specific files including:

- Maven `target/`
- Frontend `node_modules/`
- Frontend `dist/`
- Environment files except `.env.example`
- Logs
- IDE metadata
- Operating system files

Install dependencies and regenerate build output locally when needed; do not commit those generated directories.
