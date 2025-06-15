# Pages Directory Structure

This directory contains all the React pages organized by user role and functionality for better maintainability and scalability.

## Directory Structure

```
Pages/
├── admin/                 # Admin-only pages
│   ├── dashboard/         # Admin dashboard
│   │   └── Dashboard.jsx  # Main admin dashboard with calendar and notifications
│   ├── appointments/      # Admin appointment management
│   │   └── AppointmentList.jsx  # View and approve/decline appointments
│   ├── healthcare/        # Healthcare records management
│   │   └── Healthcare.jsx # Add records and authorize providers
│   ├── support/          # Admin support management
│   │   └── Support.jsx   # Handle user support tickets
│   └── index.js          # Admin pages exports
│
├── user/                 # User/Patient pages
│   ├── dashboard/        # User dashboard
│   │   ├── UserDashboard.jsx     # Main user dashboard
│   │   └── PatientLandingPage.jsx # Patient landing page
│   ├── appointments/     # User appointment booking
│   │   └── AppointmentRequestForm.jsx # Book new appointments
│   ├── records/          # User medical records
│   │   └── UserRecords.jsx # View personal medical records
│   ├── profile/          # User profile management
│   │   └── Profile.jsx   # Edit user profile
│   ├── support/          # User support
│   │   ├── UserSupportForm.jsx # Submit support tickets
│   │   └── UserSupportList.jsx # View submitted tickets
│   └── index.js          # User pages exports
│
├── auth/                 # Authentication pages
│   ├── Login.jsx         # User login page
│   ├── Signup.jsx        # User registration page
│   └── index.js          # Auth pages exports
│
└── index.js              # Main pages export file
```

## Access Control

### Admin Pages (`/admin/*`)
- Accessible only to users with admin roles
- Email-based role checking (admin@medease.com, healthcare@medease.com, provider@medease.com)
- Uses `Layout` component for navigation

### User Pages (`/user/*`)
- Accessible to regular authenticated users (patients)
- Uses `UserLayout` component for navigation
- Patient-focused functionality

### Auth Pages (`/auth/*`)
- Public pages for authentication
- No role restrictions
- Standalone pages without layout wrappers

## Routing Structure

- Admin routes: `/dashboard`, `/appointments`, `/healthcare`, `/support`
- User routes: `/user`, `/user/appointments`, `/user/records`, `/user/support`
- Auth routes: `/login`, `/signup`

## Benefits of This Structure

1. **Role-based Organization**: Clear separation between admin and user functionality
2. **Scalability**: Easy to add new features within appropriate role directories
3. **Maintainability**: Related functionality grouped together
4. **Import Optimization**: Index files allow for cleaner imports
5. **Security**: Clear access control boundaries
6. **Developer Experience**: Intuitive directory structure for team development

## Usage Examples

```jsx
// Clean imports using index files
import { Dashboard, Healthcare } from '../Pages/admin';
import { UserDashboard, Profile } from '../Pages/user';
import { Login, Signup } from '../Pages/auth';

// Or import everything from main index
import { Dashboard, UserDashboard, Login } from '../Pages';
```
