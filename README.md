# 🏥 TeleMed Connect

A modern telemedicine consultation platform built with Next.js, Supabase, and shadcn/ui. This application enables secure communication between patients and doctors through a role-based system with internal authentication.

## ✨ Features

- 🔐 **Secure Authentication**: Internal auth using Bcrypt password hashing
- 👥 **Role-Based Access**: Separate dashboards for patients and doctors
- 🎨 **Beautiful UI**: Built with shadcn/ui components and Tailwind CSS
- 🚀 **Modern Stack**: Next.js 14+ with App Router and Server Components
- 💾 **Supabase Backend**: PostgreSQL database with real-time capabilities
- 🔒 **Session Management**: HTTP-only cookies for secure session storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([Sign up free](https://supabase.com))

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Go to the SQL Editor
   - Copy contents from `supabase-schema.sql` and execute it
   - This creates tables and demo users

3. **Configure environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   Find these values in: Supabase Dashboard → Project Settings → API

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### 🧪 Demo Accounts

- **Patient**: `patient1` / `password123`
- **Doctor**: `doctor1` / `password123`

## 📁 Project Structure

```
├── app/
│   ├── api/auth/           # Authentication endpoints
│   ├── dashboard/          # Role-based dashboard
│   ├── login/              # Login page
│   └── page.tsx            # Home (redirects)
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── PatientDashboard.tsx
│   └── DoctorDashboard.tsx
├── lib/
│   ├── auth.ts             # Session management
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utilities
└── scripts/
    └── hash-password.js    # Password hashing tool
```

## 🔧 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Internal (Bcrypt + HTTP-only cookies)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript

## 🛠️ Utilities

### Hash Password

Generate bcrypt hashes for new users:

```bash
node scripts/hash-password.js yourpassword
```

## 📚 Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🔐 Security Notes

- RLS is disabled for initial development (enable in production!)
- Always use HTTPS in production
- Rotate secrets regularly
- Implement rate limiting on auth endpoints

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
