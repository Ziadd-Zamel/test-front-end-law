# Al-Mahkama Frontend v2
#TEST5
A modern Next.js 15 application for the Al-Mahkama legal system with comprehensive authentication and user management features.

## 🚀 Features

- **Multi-Method Authentication**: Credentials, OTP via Email, OTP via WhatsApp
- **Password Recovery**: Email and WhatsApp-based password reset
- **User Registration**: Complete registration flow with verification
- **Modern UI**: Built with Radix UI, Tailwind CSS, and Framer Motion
- **Type Safety**: Full TypeScript implementation with Zod validation
- **State Management**: React Query for server state management
- **Session Management**: NextAuth.js with JWT tokens and refresh token handling

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query (React Query)
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth API endpoints
│   └── auth/              # Authentication pages
│       ├── login/         # Login flow
│       ├── register/      # User registration
│       ├── otp-email/     # Email OTP verification
│       ├── otp-whatsapp/  # WhatsApp OTP verification
│       ├── otp-login/     # OTP-based login
│       └── forget-password/ # Password recovery
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── providers/        # Context providers
├── lib/                  # Utilities and configurations
│   ├── schemas/          # Zod validation schemas
│   ├── types/            # TypeScript type definitions
│   ├── actions/          # Server actions
│   └── utils/            # Utility functions
└── auth.ts               # NextAuth configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend-law-v2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   API=your-backend-api-url
   NEXT_PUBLIC_API=your-public-api-url
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

The project uses a comprehensive design system built on:

- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Component variant management
- **Framer Motion**: Smooth animations and transitions

## 🔧 Configuration

### NextAuth.js

Configured with multiple providers and custom callbacks for token management and session handling.

### React Query

Set up for efficient server state management with automatic caching and background updates.

### Form Validation

Zod schemas provide runtime type checking and validation for all forms.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing
---

For detailed authentication documentation, see [AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md)
