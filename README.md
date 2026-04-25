# Smart Campus Operations Hub
## Complete System Documentation
### IT3030 PAF Assignment 2026 | All Modules Explained

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Module A – Facilities & Assets Catalogue](#2-module-a--facilities--assets-catalogue)
3. [Module B – Booking Management](#3-module-b--booking-management)
4. [Module C – Maintenance & Incident Ticketing](#4-module-c--maintenance--incident-ticketing)
5. [Module D – Notifications](#5-module-d--notifications)
6. [Module E – Authentication & Authorization](#6-module-e--authentication--authorization)
7. [Frontend Components Explained](#7-frontend-components-explained)
8. [QR Code Check-In Feature](#8-qr-code-check-in-feature)
9. [Status Badges Explained](#9-status-badges-explained)
10. [Database Collections](#10-database-collections)
11. [API Endpoints Summary](#11-api-endpoints-summary)
12. [Git Branch Strategy](#12-git-branch-strategy)

---

## 1. System Overview

The Smart Campus Operations Hub is a full-stack web platform built for a university to manage two core operations in one place — **facility bookings** and **maintenance incident handling**.

**Tech Stack:**
- Backend: Java 17 + Spring Boot 3 + Spring Security + MongoDB
- Frontend: React 18 + Vite + Tailwind CSS + DM Sans font
- Auth: OAuth2 (Google Sign-In) + JWT
- Database: MongoDB Atlas
- CI/CD: GitHub Actions

**How the modules connect:**
```
User logs in (Module E - Auth)
        ↓
Browses facilities (Module A - Catalog)
        ↓
Makes a booking (Module B - Booking)
        ↓
Gets notified of approval (Module D - Notifications)
        ↓
Reports a fault at the venue (Module C - Tickets)
        ↓
Gets notified of resolution (Module D - Notifications)
```

---

## 2. Module A – Facilities & Assets Catalogue

### What it does
Maintains a catalogue of all bookable resources in the university — lecture halls, computer labs, meeting rooms, and equipment like projectors and cameras.

### Key Features
- Add, edit, delete resources (Admin only)
- Each resource has: name, type, capacity, location, availability windows, status
- Resource status: `ACTIVE` or `OUT_OF_SERVICE`
- Search and filter by type, capacity, location
- Users can browse all active resources

### Why it matters for Booking
When a user opens the New Booking form, it calls the Catalog API to load the resource dropdown. Without this module, users would have to type the resource ID manually which is error-prone.

### API Endpoints
| Method | Endpoint | Who | What |
|--------|----------|-----|------|
| GET | `/api/resources` | USER, ADMIN | Get all resources with filters |
| GET | `/api/resources/{id}` | USER, ADMIN | Get one resource |
| POST | `/api/resources` | ADMIN only | Create a new resource |
| PATCH | `/api/resources/{id}` | ADMIN only | Update resource details |
| DELETE | `/api/resources/{id}` | ADMIN only | Remove a resource |

### Resource Object
```json
{
  "id": "664abc123",
  "name": "Lecture Hall A",
  "type": "ROOM",
  "capacity": 120,
  "location": "Block A, Floor 1",
  "availabilityWindows": ["08:00-18:00"],
  "status": "ACTIVE"
}
```

### Resource Types
| Type | Example |
|------|---------|
| ROOM | Lecture halls, meeting rooms |
| LAB | Computer labs, science labs |
| EQUIPMENT | Projectors, cameras, microphones |

---

## 3. Module B – Booking Management

### What it does
Allows users to request bookings for campus resources and gives admins tools to approve or reject those requests. Includes QR code check-in for approved bookings.

### Key Features
- Create booking requests with date, time, purpose, attendees
- Conflict detection — prevents double-booking the same resource
- Booking workflow: PENDING → APPROVED / REJECTED → CHECKED_IN
- Users can cancel their own bookings
- Admin can view all bookings with status filters
- QR code generated on approval for physical check-in

### Booking Workflow
```
User submits booking
        ↓
    PENDING
        ↓              ↓
   APPROVED         REJECTED (with reason)
        ↓
User scans QR at venue
        ↓
   CHECKED_IN
```
At any PENDING or APPROVED stage → user can CANCEL

### BookingForm — What it does
The form that users fill in to create a booking request.

1. **Loads resource dropdown** from Catalog module (`GET /api/resources?status=ACTIVE`)
2. **Shows resource details** — location, capacity, availability when resource is selected
3. **Collects** start time, end time, purpose, expected attendees
4. **Validates** end time is after start time before submitting
5. **Sends** `POST /api/bookings` with JWT token attached
6. **Shows conflict error** if the resource is already booked at that time
7. **Redirects** to My Bookings page on success

### CreateBookingPage — What it does
Just a page wrapper. It shows a green hero banner at the top and holds BookingForm inside a white card. When the user clicks ➕ New Booking in the sidebar, this page loads.

### BookingCard — What it does
Each booking in the list is shown as a card. It displays:
- Resource name and type
- Date, time range, attendees
- Status badge
- Purpose
- Admin note (if rejected or approved with note)
- Buttons: View Details, Cancel (user), Approve/Reject (admin)
- Inline note box for admin to type approval or rejection reason

### BookingDetailPage — What it does
Shows full details of a single booking. Additionally:
- Fetches full resource info from Catalog module
- Shows who booked it (name + email from JWT)
- Shows check-in timestamp if CHECKED_IN
- Shows QR code if status is APPROVED

### API Endpoints
| Method | Endpoint | Who | What |
|--------|----------|-----|------|
| POST | `/api/bookings` | USER, ADMIN | Create a booking request |
| GET | `/api/bookings/my` | USER, ADMIN | Get my own bookings |
| GET | `/api/bookings` | ADMIN only | Get all bookings |
| GET | `/api/bookings/{id}` | USER, ADMIN | Get booking by ID |
| PATCH | `/api/bookings/{id}/action` | ADMIN only | Approve or reject |
| DELETE | `/api/bookings/{id}` | USER, ADMIN | Cancel a booking |
| POST | `/api/bookings/checkin` | Public | QR check-in by token |

### Conflict Detection
When a new booking is submitted, the backend checks MongoDB for any existing PENDING or APPROVED booking for the same resource where the time ranges overlap. If found, it returns `409 Conflict` with a message explaining how many conflicts were found.

```java
// MongoDB query that detects overlapping bookings
{ 'resourceId': X, 'status': { $in: ['PENDING','APPROVED'] },
  'startTime': { $lt: endTime }, 'endTime': { $gt: startTime } }
```

---

## 4. Module C – Maintenance & Incident Ticketing

### What it does
Allows users to report faults or incidents at campus facilities — for example a broken projector, a leaking roof, or a damaged door. Technicians are assigned to resolve the tickets.

### Key Features
- Create incident tickets with category, description, priority, location
- Attach up to 3 images as evidence (damaged equipment, error screens)
- Assign technician/staff to a ticket
- Ticket workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Admin can also set REJECTED with a reason
- Comments system — users and staff can add comments on tickets
- Comment ownership — only the author can edit or delete their comment

### Ticket Workflow
```
User creates ticket
        ↓
      OPEN
        ↓
Technician assigned
        ↓
   IN_PROGRESS
        ↓              ↓
   RESOLVED         REJECTED (admin, with reason)
        ↓
     CLOSED
```

### Ticket Fields
| Field | Description |
|-------|-------------|
| resourceId | Which resource/location has the issue |
| category | ELECTRICAL, PLUMBING, EQUIPMENT, FURNITURE, OTHER |
| description | Detailed description of the fault |
| priority | LOW, MEDIUM, HIGH, URGENT |
| preferredContact | How the user wants to be contacted |
| attachments | Up to 3 image URLs |
| assignedTo | Technician user ID |
| resolutionNotes | How it was fixed |

### API Endpoints
| Method | Endpoint | Who | What |
|--------|----------|-----|------|
| POST | `/api/tickets` | USER, ADMIN | Create a ticket |
| GET | `/api/tickets/my` | USER | My reported tickets |
| GET | `/api/tickets` | ADMIN | All tickets |
| GET | `/api/tickets/{id}` | USER, ADMIN | Get ticket details |
| PATCH | `/api/tickets/{id}/status` | ADMIN, TECHNICIAN | Update status |
| PATCH | `/api/tickets/{id}/assign` | ADMIN | Assign technician |
| POST | `/api/tickets/{id}/comments` | USER, ADMIN | Add comment |
| PUT | `/api/tickets/{id}/comments/{cid}` | Owner | Edit own comment |
| DELETE | `/api/tickets/{id}/comments/{cid}` | Owner | Delete own comment |

### Comments Module — What it does
Comments allow users and staff to communicate on a ticket. For example a user can ask for an update, a technician can reply with progress notes.

**Comment ownership rules:**
- Only the person who wrote the comment can edit or delete it
- Admins can delete any comment
- Once a ticket is CLOSED, no new comments can be added

---

## 5. Module D – Notifications

### What it does
Automatically notifies users when something important happens related to their bookings or tickets. Users can see notifications in a panel inside the app.

### When notifications are sent
| Event | Who gets notified |
|-------|------------------|
| Booking approved | The user who made the booking |
| Booking rejected | The user who made the booking |
| Booking cancelled | The user who made the booking |
| Ticket status changed | The user who reported the ticket |
| New comment on ticket | The ticket owner |
| Technician assigned | The assigned technician |

### Key Features
- Notification panel accessible from sidebar (bell icon with red badge count)
- Mark individual notifications as read
- Mark all as read
- Filter by read/unread
- Notification preferences (enable/disable categories)

### Notification Object
```json
{
  "id": "664notif001",
  "userId": "664user123",
  "title": "Booking Approved",
  "message": "Your booking for Lecture Hall A on 1 Jun 2026 has been approved.",
  "type": "BOOKING_APPROVED",
  "read": false,
  "createdAt": "2026-04-22T10:30:00",
  "referenceId": "664booking456"
}
```

### API Endpoints
| Method | Endpoint | Who | What |
|--------|----------|-----|------|
| GET | `/api/notifications` | USER | Get my notifications |
| PATCH | `/api/notifications/{id}/read` | USER | Mark one as read |
| PATCH | `/api/notifications/read-all` | USER | Mark all as read |
| DELETE | `/api/notifications/{id}` | USER | Delete a notification |
| GET | `/api/notifications/count` | USER | Get unread count (for badge) |

### useNotificationCount Hook
The sidebar calls this hook to get the unread notification count and display it as a red badge on the bell icon. It polls the `/api/notifications/count` endpoint.

---

## 6. Module E – Authentication & Authorization

### What it does
Handles user registration, login via Google OAuth2, JWT token generation, and role-based access control across all modules.

### Key Features
- Google Sign-In via OAuth2
- JWT token issued after successful login
- Roles: USER, ADMIN, TECHNICIAN
- Role-based route protection (frontend + backend)
- Secure endpoints — each module checks the JWT

### How OAuth2 + JWT Works
```
1. User clicks "Sign in with Google"
2. Google authenticates the user
3. OAuth2SuccessHandler receives the user info
4. Backend creates/updates user in MongoDB
5. Backend generates JWT with claims:
   - sub: userId
   - name: "Kavin Perera"
   - email: "kavin@sliit.lk"
   - role: "ROLE_USER"
6. JWT sent to frontend (in URL redirect or cookie)
7. Frontend saves token to localStorage
8. Every API request includes: Authorization: Bearer <token>
9. JwtAuthFilter validates token on every request
10. SecurityConfig checks role for each endpoint
```

### JWT Claims (what's inside the token)
| Claim | Value | Used by |
|-------|-------|---------|
| `sub` | user MongoDB ID | All modules — identifies the user |
| `name` | Full name | Booking — stored as userName |
| `email` | Email address | Booking — stored as userEmail |
| `role` | ROLE_USER or ROLE_ADMIN | All modules — controls access |
| `picture` | Google profile photo URL | Sidebar — shows avatar |

### Role Permissions
| Endpoint | USER | ADMIN | TECHNICIAN |
|----------|------|-------|------------|
| Create booking | ✅ | ✅ | ✅ |
| View own bookings | ✅ | ✅ | ✅ |
| View all bookings | ❌ | ✅ | ❌ |
| Approve/Reject booking | ❌ | ✅ | ❌ |
| Create ticket | ✅ | ✅ | ✅ |
| Assign technician | ❌ | ✅ | ❌ |
| Update ticket status | ❌ | ✅ | ✅ |
| Create resource | ❌ | ✅ | ❌ |
| View resources | ✅ | ✅ | ✅ |

---

## 7. Frontend Components Explained

### Layout Components

#### `Sidebar.jsx`
The left navigation panel. Shows all nav links grouped into sections (CAMPUS, ADMIN). Handles collapse/expand. Shows user avatar, name and role at the bottom. Has a Sign Out button. Admin section only appears if the user has ROLE_ADMIN.

#### `App.jsx`
The root component. Sets up React Router with all routes. Wraps everything in the app shell layout (sidebar + main content area). Hides sidebar on the QR check-in page.

### Booking Components

#### `BookingStatusBadge.jsx`
A small coloured pill that shows the current status of a booking. Each status has its own colour — yellow for PENDING, green for APPROVED, red for REJECTED, grey for CANCELLED, blue for CHECKED_IN. Has a coloured dot on the left.

#### `BookingCard.jsx`
A card that represents one booking in the list. Shows resource, date, time, purpose, status badge, admin note, and action buttons. Admin version shows Approve/Reject buttons with an inline note textarea. User version shows Cancel button only for their own PENDING or APPROVED bookings.

#### `BookingForm.jsx`
The create booking form. Loads the resource dropdown from Catalog API. Shows resource details when selected. Validates times. Sends POST to backend. Shows conflict or validation errors from backend as toast messages.

#### `BookingDetailPage.jsx`
Full detail view of one booking. Fetches booking AND resource details. Shows all fields in a structured card. Displays QR code if booking is APPROVED. Shows check-in timestamp if CHECKED_IN.

#### `BookingsPage.jsx`
The list page. Shows either My Bookings (user) or All Bookings (admin) depending on the `mode` prop. Has status filter pills at the top. Shows stat cards with counts for admin view. Renders a BookingCard for each booking.

#### `CreateBookingPage.jsx`
A page wrapper with a green hero banner. Renders BookingForm inside a white card. Loaded when user clicks ➕ New Booking.

### QR Components

#### `QrCodeDisplay.jsx`
Renders a QR code image from the booking's qrToken. The QR encodes the URL `http://yourapp.com/checkin?token=<uuid>`. Shown on the BookingDetailPage when booking is APPROVED.

#### `QrCheckinPage.jsx`
Full-screen page loaded when someone scans the QR code. Reads the token from the URL, calls `POST /api/bookings/checkin?token=X`. Shows a green success card or red error card. No login required — it is a public page.

### API Layers

#### `bookingApi.js`
All 7 API calls for the booking module. Has an axios interceptor that reads the JWT from localStorage and attaches it to every request as `Authorization: Bearer <token>`. Has a response interceptor that redirects to /login if a 401 is received.

#### `resourceApi.js`
Two API calls for the catalog module — getAll (for the booking form dropdown) and getById (for the booking detail page). Also attaches JWT token.

#### `authApi.js`
Login and register API calls. Does not need a token since these are public endpoints.

### Hooks

#### `useBookings.js`
Custom React hook that fetches the booking list. Takes a `mode` prop — if `admin` it calls getAllBookings, otherwise getMyBookings. Returns bookings array, loading state, error state, and a refetch function.

#### `useNotificationCount.js`
Custom hook that fetches the unread notification count for the sidebar badge. Polls the notifications count endpoint periodically.

### Context

#### `AuthContext.jsx`
React context that stores the logged-in user globally (id, name, email, role, token). Persists to localStorage so the user stays logged in on page refresh. Provides login and logout functions used across the app.

### Route Guards

#### `ProtectedRoute.jsx`
Wraps pages that require login. If no user is in AuthContext, redirects to /login. `AdminRoute` variant also checks for ROLE_ADMIN and redirects to home if not admin.

---

## 8. QR Code Check-In Feature

### Why it exists
Without check-in, someone could book a room and never show up, blocking others from using it. QR check-in proves that the person physically arrived at the venue.

### How it works end to end
```
1. Admin approves booking
        ↓
2. Backend generates UUID token → saves to booking.qrToken
        ↓
3. User opens booking detail page → sees QR code image
        ↓
4. User goes to venue → scans QR with phone camera
        ↓
5. Browser opens: /checkin?token=<uuid>
        ↓
6. QrCheckinPage calls POST /api/bookings/checkin?token=X
        ↓
7. Backend validates:
   - Token exists in MongoDB
   - Booking status is APPROVED
   - Current time is within 15 min before start to end time
        ↓
8. Status changes to CHECKED_IN
   checkedInAt timestamp recorded
        ↓
9. Green success screen shown to user
```

### Security
- Token is a UUID — random, not guessable
- One-time use — after check-in status changes so it cannot be used again
- Time window — only works 15 minutes before start time until end time
- No login needed to check in — the token IS the authentication

### For your report — one sentence
*"QR check-in replaces manual sign-in sheets by automatically verifying physical attendance at the booked facility, creating an auditable record of actual resource usage."*

---

## 9. Status Badges Explained

### Booking Statuses

| Status | Colour | Meaning | Next action |
|--------|--------|---------|-------------|
| PENDING | 🟡 Yellow | Submitted, waiting for admin review | Wait or Cancel |
| APPROVED | 🟢 Green | Admin accepted, QR code ready | Scan QR at venue |
| REJECTED | 🔴 Red | Admin denied with reason | Read note, rebook |
| CANCELLED | ⚫ Grey | User or admin cancelled | Create new booking |
| CHECKED_IN | 🔵 Blue | QR scanned, attendance recorded | Done |

### Ticket Statuses

| Status | Colour | Meaning |
|--------|--------|---------|
| OPEN | 🟡 Yellow | Reported, not yet assigned |
| IN_PROGRESS | 🔵 Blue | Technician assigned and working |
| RESOLVED | 🟢 Green | Technician marked as fixed |
| CLOSED | ⚫ Grey | Admin confirmed and closed |
| REJECTED | 🔴 Red | Admin rejected with reason |

---

## 10. Database Collections

### `users` collection
```json
{
  "_id": "664user001",
  "name": "Kavin Perera",
  "email": "kavin@sliit.lk",
  "picture": "https://googlephoto...",
  "role": "ROLE_USER",
  "provider": "google",
  "createdAt": "2026-04-01T09:00:00"
}
```

### `resources` collection
```json
{
  "_id": "664res001",
  "name": "Lecture Hall A",
  "type": "ROOM",
  "capacity": 120,
  "location": "Block A, Floor 1",
  "availabilityWindows": ["08:00-18:00"],
  "status": "ACTIVE",
  "createdAt": "2026-04-01T09:00:00"
}
```

### `bookings` collection
```json
{
  "_id": "664bk001",
  "resourceId": "664res001",
  "resourceName": "Lecture Hall A",
  "resourceType": "ROOM",
  "userId": "664user001",
  "userName": "Kavin Perera",
  "userEmail": "kavin@sliit.lk",
  "startTime": "2026-06-01T09:00:00",
  "endTime": "2026-06-01T11:00:00",
  "purpose": "PAF Group Study",
  "expectedAttendees": 25,
  "status": "APPROVED",
  "adminNote": "Please clean after use",
  "approvedBy": "664admin001",
  "qrToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "checkedInAt": null,
  "createdAt": "2026-04-22T10:00:00",
  "updatedAt": "2026-04-22T10:30:00"
}
```

### `tickets` collection
```json
{
  "_id": "664tk001",
  "resourceId": "664res001",
  "reportedBy": "664user001",
  "category": "EQUIPMENT",
  "description": "Projector not working in Lecture Hall A",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "assignedTo": "664tech001",
  "attachments": ["url1", "url2"],
  "resolutionNotes": "",
  "comments": [],
  "createdAt": "2026-04-22T14:00:00"
}
```

### `notifications` collection
```json
{
  "_id": "664notif001",
  "userId": "664user001",
  "title": "Booking Approved",
  "message": "Your booking for Lecture Hall A has been approved.",
  "type": "BOOKING_APPROVED",
  "read": false,
  "referenceId": "664bk001",
  "createdAt": "2026-04-22T10:30:00"
}
```

---

## 11. API Endpoints Summary

### Auth Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/oauth2/authorization/google` | None | Start Google login |
| GET | `/api/auth/me` | JWT | Get current user info |
| POST | `/api/auth/logout` | JWT | Logout |

### Catalog Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/resources` | JWT | Get all resources |
| GET | `/api/resources/{id}` | JWT | Get one resource |
| POST | `/api/resources` | ADMIN | Create resource |
| PATCH | `/api/resources/{id}` | ADMIN | Update resource |
| DELETE | `/api/resources/{id}` | ADMIN | Delete resource |

### Booking Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | JWT | Create booking |
| GET | `/api/bookings/my` | JWT | My bookings |
| GET | `/api/bookings` | ADMIN | All bookings |
| GET | `/api/bookings/{id}` | JWT | Get one booking |
| PATCH | `/api/bookings/{id}/action` | ADMIN | Approve or reject |
| DELETE | `/api/bookings/{id}` | JWT | Cancel booking |
| POST | `/api/bookings/checkin` | None | QR check-in |

### Tickets Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tickets` | JWT | Create ticket |
| GET | `/api/tickets/my` | JWT | My tickets |
| GET | `/api/tickets` | ADMIN | All tickets |
| GET | `/api/tickets/{id}` | JWT | Get one ticket |
| PATCH | `/api/tickets/{id}/status` | ADMIN/TECH | Update status |
| PATCH | `/api/tickets/{id}/assign` | ADMIN | Assign technician |
| POST | `/api/tickets/{id}/comments` | JWT | Add comment |
| PUT | `/api/tickets/{id}/comments/{cid}` | Owner | Edit comment |
| DELETE | `/api/tickets/{id}/comments/{cid}` | Owner | Delete comment |

### Notifications Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | JWT | Get my notifications |
| GET | `/api/notifications/count` | JWT | Get unread count |
| PATCH | `/api/notifications/{id}/read` | JWT | Mark one read |
| PATCH | `/api/notifications/read-all` | JWT | Mark all read |
| DELETE | `/api/notifications/{id}` | JWT | Delete notification |

---

## 12. Git Branch Strategy

### Branch Naming (Monali's branches)
```
feature/monali/project-setup
feature/monali/booking-model
feature/monali/booking-api
feature/monali/conflict-detection
feature/monali/qr-checkin-api
feature/monali/booking-ui
feature/monali/qr-checkin-ui
feature/monali/booking-tests
```

### Workflow
```bash
# Always start from latest main
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/monali/booking-api

# Work and commit regularly
git add .
git commit -m "feat(booking): add BookingController with 6 REST endpoints"

# Push and open Pull Request
git push origin feature/monali/booking-api
```

### Commit Message Format
```
feat(booking): add conflict detection query
fix(booking): fix overlapping time check
test(booking): add unit tests for BookingService
docs(booking): update README with setup steps
refactor(booking): extract booking mapper to separate class
```

### What to show at Viva
```bash
# Show your commit history
git log --oneline

# Show your branches
git branch -a

# Show what you changed in a branch
git diff main feature/monali/booking-api
```

---

## Summary Table — Who Built What

| Module | Backend | Frontend | Key Feature |
|--------|---------|----------|-------------|
| A – Catalog | Teammate | Teammate | Resource management |
| B – Booking | **Monali** | **Monali** | Booking + QR check-in |
| C – Tickets | Teammate | Teammate | Incident management |
| D – Notifications | Teammate | Teammate | Real-time alerts |
| E – Auth | Teammate | Teammate | OAuth2 + JWT |

---

*Smart Campus Operations Hub — IT3030 PAF Assignment 2026 — SLIIT Faculty of Computing*
