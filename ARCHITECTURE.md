# 🏗️ TeleMed Connect - Architecture Overview

## 🎯 Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       User Visits App                        │
│                    http://localhost:3000                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  app/page.tsx         │
                │  (Checks session)     │
                └───────┬───────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
    ┌───────▼───────┐      ┌───────▼────────┐
    │ No Session    │      │ Has Session    │
    └───────┬───────┘      └───────┬────────┘
            │                      │
            ▼                      ▼
    ┌───────────────┐      ┌──────────────────┐
    │ /login        │      │ /dashboard       │
    └───────┬───────┘      └──────┬───────────┘
            │                     │
            ▼                     │
    ┌──────────────────┐          │
    │ Login Form       │          │
    │ (shadcn/ui)      │          │
    └──────┬───────────┘          │
           │                      │
           ▼                      │
    ┌──────────────────┐          │
    │ POST /api/auth/  │          │
    │      login       │          │
    └──────┬───────────┘          │
           │                      │
           ▼                      │
    ┌──────────────────┐          │
    │ Supabase Query   │          │
    │ Check User       │          │
    └──────┬───────────┘          │
           │                      │
           ▼                      │
    ┌──────────────────┐          │
    │ Bcrypt Compare   │          │
    │ Password Hash    │          │
    └──────┬───────────┘          │
           │                      │
           ▼                      │
    ┌──────────────────┐          │
    │ Set HTTP-only    │          │
    │ Cookie Session   │          │
    └──────┬───────────┘          │
           │                      │
           └──────────┬───────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │ /dashboard            │
          │ (Role-based routing)  │
          └───────┬───────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────────┐ ┌──────────────────┐
│ Patient          │ │ Doctor           │
│ Dashboard        │ │ Dashboard        │
│ (patient view)   │ │ (doctor view)    │
└──────────────────┘ └──────────────────┘
```

## 📊 Database Schema

```sql
┌─────────────────────────────────────────────────────────────┐
│                         USERS TABLE                          │
├──────────────┬──────────────┬──────────────────────────────┤
│ id           │ UUID (PK)    │ Primary identifier           │
│ username     │ TEXT         │ Unique login name            │
│ password_hash│ TEXT         │ Bcrypt hashed password       │
│ user_type    │ TEXT         │ 'patient' or 'doctor'        │
│ created_at   │ TIMESTAMP    │ Account creation time        │
└──────────────┴──────────────┴──────────────────────────────┘
                            │
                            │ Referenced by:
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌────────────────────────────┐  ┌────────────────────────────┐
│ CONSULTATION_REQUESTS      │  │ CONSULTATION_REPLIES       │
├────────────────────────────┤  ├────────────────────────────┤
│ id (UUID, PK)              │  │ id (UUID, PK)              │
│ patient_id (FK → users)    │  │ consultation_id (FK)       │
│ doctor_id (FK → users)     │  │ user_id (FK → users)       │
│ title                      │  │ message                    │
│ description                │  │ created_at                 │
│ status                     │  └────────────────────────────┘
│ created_at                 │
│ updated_at                 │
└────────────────────────────┘
```

## 🔐 Authentication System

### Session Management

```typescript
// lib/auth.ts - Session Utilities

setSession(user)     →  Creates HTTP-only cookie
                        - Secure in production
                        - 7-day expiration
                        - Contains: id, username, user_type

getSession()         →  Retrieves user from cookie
                        - Returns User | null
                        - Used for server-side auth checks

clearSession()       →  Deletes session cookie
                        - Called on logout
```

### Password Flow

```
Plain Password → bcrypt.hash(password, 10) → Stored in DB
                                              (password_hash)

Login Attempt:
  User Input → bcrypt.compare(input, stored_hash) → Boolean
                                                     ├─ true: Login success
                                                     └─ false: Invalid creds
```

## 🎨 UI Component Tree

```
app/
├─ page.tsx (Redirect Logic)
├─ login/page.tsx
│  └─ Card
│     ├─ CardHeader
│     │  ├─ CardTitle
│     │  └─ CardDescription
│     └─ CardContent
│        ├─ Label + Input (username)
│        ├─ Label + Input (password)
│        └─ Button (submit)
│
└─ dashboard/page.tsx
   ├─ PatientDashboard
   │  ├─ Header (title + logout)
   │  ├─ Stats Grid
   │  │  ├─ Card (My Consultations) - Blue
   │  │  ├─ Card (Completed) - Green
   │  │  └─ Card (Pending) - Purple
   │  └─ Content Grid
   │     ├─ Card (Quick Actions)
   │     └─ Card (Recent Activity)
   │
   └─ DoctorDashboard
      ├─ Header (title + logout)
      ├─ Stats Grid
      │  ├─ Card (Pending Requests) - Cyan
      │  ├─ Card (Active Cases) - Emerald
      │  └─ Card (Completed) - Indigo
      └─ Content Grid
         ├─ Card (Consultation Queue)
         └─ Card (Today's Schedule)
```

## 🔄 API Routes

### POST /api/auth/login
```typescript
Input:  { username: string, password: string }
Process:
  1. Validate input
  2. Query Supabase for user
  3. Compare password with bcrypt
  4. Set session cookie
Output: { success: boolean, user?: User, message?: string }
```

### POST /api/auth/logout
```typescript
Input:  (none)
Process:
  1. Clear session cookie
Output: { success: boolean, message: string }
```

## 📦 Dependencies

### Core
- `next` - Framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety

### Database & Auth
- `@supabase/supabase-js` - Database client
- `bcryptjs` - Password hashing

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `clsx` & `tailwind-merge` - Class name utilities
- `class-variance-authority` - Component variants
- `lucide-react` - Icons (available for future use)

## 🎨 Design System

### Colors
- **Primary**: Slate (neutral, professional)
- **Patient Theme**: Blue gradients
- **Doctor Theme**: Cyan/Emerald gradients
- **Status Colors**: 
  - Success: Green
  - Pending: Purple/Indigo
  - Error: Red

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: text-sm to text-base
- **Descriptions**: text-slate-600

### Spacing
- Container: max-w-7xl with p-6
- Card gaps: gap-6
- Grid: responsive (sm/md/lg breakpoints)

## 🔒 Security Features

✅ **Implemented:**
- HTTP-only cookies (can't be accessed via JavaScript)
- Bcrypt password hashing (10 rounds)
- Password never stored in plain text
- Secure session storage
- Input validation on login

⚠️ **To Add for Production:**
- Enable RLS (Row Level Security) on Supabase
- Rate limiting on auth endpoints
- CSRF protection
- HTTPS enforcement
- Password strength requirements
- Account lockout after failed attempts

## 📱 Responsive Design

All components are mobile-first:
- Grid layouts adapt: 1 col → 2 cols → 3 cols
- Touch-friendly button sizes (h-9, h-10)
- Readable text sizes
- Proper spacing on small screens

## 🚀 Performance Optimizations

- Server Components by default (faster initial load)
- Client Components only where needed ('use client')
- Efficient session checking
- Indexed database columns
- Minimal bundle size with tree-shaking

## 📈 Future Architecture Considerations

When adding consultation features:

1. **State Management**: Consider Zustand or React Context
2. **Real-time**: Supabase Realtime subscriptions
3. **File Uploads**: Supabase Storage
4. **Notifications**: Web Push API or email
5. **Search**: Full-text search in PostgreSQL
6. **Pagination**: Cursor-based pagination
7. **Caching**: React Query or SWR

## 🛠️ Development Workflow

```bash
# Development
npm run dev          # Start dev server

# Production Build
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Utilities
node scripts/hash-password.js <password>  # Generate hash
```

## 📝 File Organization

```
Routing & Pages:     app/**/*.tsx
API Endpoints:       app/api/**/*.ts
UI Components:       components/ui/**/*.tsx
Feature Components:  components/*.tsx
Utilities:           lib/**/*.ts
Types:              lib/types.ts
Styles:             app/globals.css
Config:             *.config.* , tsconfig.json
Database:           supabase-schema.sql
Scripts:            scripts/*.js
```

This architecture provides a solid foundation for building out the full consultation features! 🎉

