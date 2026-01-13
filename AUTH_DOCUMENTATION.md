## Overview

This document is a guide to the authentication system. The system implements multiple authentication methods with a focus on security.

## Architecture

The authentication system is built on **NextAuth.js v4** with custom providers and JWT token management. It supports multiple authentication flows and integrates seamlessly with a backend API.

### Core Components

- **NextAuth.js**: Authentication framework
- **JWT Tokens**: Access and refresh token management
- **Custom Providers**: Credentials and verification code providers
- **Server Actions**: API communication layer
- **React Query**: Client-side state management
- **Zod Validation**: Runtime type checking and validation

## Folder Structure

```
src/app/auth/
├── _components/                    # Shared auth components
│   ├── auth-layout.tsx            # Main auth layout wrapper
│   ├── otp-form.tsx               # Reusable OTP input component
│   └── password-input.tsx         # Password input with visibility toggle
│
├── login/                         # Traditional login flow
│   ├── _components/
│   │   └── login-form.tsx         # Login form component
│   ├── _hooks/
│   │   └── use-login.ts           # Login logic hook
│   └── page.tsx                   # Login page
│
├── register/                      # User registration flow
│   ├── _actions/
│   │   └── register.action.ts     # Registration server action
│   ├── _components/
│   │   └── register-form.tsx      # Registration form
│   ├── _hooks/
│   │   └── use-register.tsx       # Registration logic hook
│   └── page.tsx                   # Registration page
│
├── otp-login/                     # OTP-based login flow
│   ├── _components/
│   │   └── otp-login-form.tsx     # OTP verification form
│   ├── _hooks/
│   │   └── use-verification-login.ts # OTP login logic
│   ├── send/                      # Send OTP step
│   │   ├── _components/
│   │   │   └── send-verification-code-form.tsx
│   │   ├── _actions/
│   │   │   └── send-verification-code.action.ts
│   │   ├── _hooks/
│   │   │   └── use-send-verification-code.ts
│   │   └── page.tsx
│   └── otp/
│       └── page.tsx               # OTP verification page
│
├── otp-email/                     # Email OTP verification
│   ├── _components/
│   │   └── verify-email-form.tsx  # Email verification form
│   ├── _actions/
│   │   └── verify-email.action.ts # Email verification action
│   ├── _hooks/
│   │   └── use-verify-email.tsx   # Email verification hook
│   └── page.tsx
│
├── otp-whatsapp/                  # WhatsApp OTP verification
│   ├── _components/
│   │   └── verify-whatsapp-form.tsx
│   ├── _actions/
│   │   └── verify-whatsapp.action.ts
│   ├── _hooks/
│   │   └── use-verify-whatsapp.tsx
│   └── page.tsx
│
└── forget-password/               # Password recovery flow
    ├── send/                      # Send reset request
    │   ├── _components/
    │   │   └── forget-password-form.tsx
    │   ├── _actions/
    │   │   └── forget-password.action.ts
    │   ├── _hooks/
    │   │   └── use-forget-password.ts
    │   └── page.tsx
    └── reset-password/            # Reset password
        ├── _components/
        │   ├── reset-email-form.tsx
        │   └── reset-whats-form.tsx
        ├── _actions/
        │   └── reset-password.action.ts
        ├── _hooks/
        │   ├── use-reset-email-password.ts
        │   ├── use-reset-whats-password.ts
        │   └── use-verify-forget.ts
        ├── email/
        │   └── page.tsx
        ├── otp/
        │   ├── _components/
        │   │   └── verify-forget-form.tsx
        │   └── page.tsx
        └── whatsapp/
            └── page.tsx
```

## Authentication Flows

### 1. Credentials Login Flow

**Path**: `/auth/login`

**Process**:

1. User enters identity and password
2. API call to `/Login` endpoint
3. JWT token and refresh token received
4. Session created with NextAuth.js
5. Redirect to .......

### 2. OTP Login Flow

**Path**: `/auth/otp-login`

**Process**:

1. **Send OTP** (`/auth/otp-login/send`):

   - User enters identity
   - API call to `/Login-OTP` endpoint
   - Verification token stored in cookies
   - Redirect to OTP verification

2. **Verify OTP** (`/auth/otp-login/otp`):
   - User enters 6-digit OTP code
   - API call to `/Verify/Code` with stored token
   - Session created with verification code provider
   - Redirect to dashboard

### 3. Registration Flow

**Path**: `/auth/register`

**Process**:

1. User fills registration form with:

   - identity
   - Full name
   - Date of birth
   - Email
   - Phone number
   - Password and confirmation

2. Form validation and API call to registration endpoint
3. Registration token stored in cookies
4. OTP verification process
5. last step done by admin (Account activation)

### 4. Password Recovery Flow

**Path**: `/auth/forget-password`

**Process**:

1. **Send Reset Request** (`/auth/forget-password/send`):

   - User enters identity
   - Chooses reset method (Email/WhatsApp)
   - API call to endpoint
   - Reset token stored in cookies

2. **Verify OTP** (`/auth/forget-password/reset-password/otp`):

   -if the choise was email then the reset link is send to the mail and navgate to the login page
   si this step is only when wahtsap is choosed

   - User enters OTP code
   - Token verification

3. **Reset Password** (`/auth/forget-password/reset-password/email` or `/whatsapp`):

   - User enters new password
   - Password confirmation
   - API call to reset password endpoint
   - Redirect to login

## 🔧 Technical Implementation

### NextAuth.js Configuration

**File**: `src/auth.ts`

**Providers**:

1. **Credentials Provider**: Traditional login
2. **Verification Code Provider**: OTP-based login

**Callbacks**:

- `jwt`: Token management and refresh logic
- `session`: Session data transformation

### Server Actions

Server actions handle API communication:

- Form submission logic
- Error handling
- Cookie management
- Response transformation

### React Query Integration

Custom hooks use React Query for:

- API state management
- Loading states
- Error handling
- Optimistic updates
- Cache management

## 🛡️ Security Features

### Token Management

- JWT access tokens with 15-minute expiration
- Refresh token rotation
- Secure token storage in HTTP-only cookies
- Automatic token refresh

### Validation

- Client-side validation with Zod
- Server-side validation
- Input sanitization
- CSRF protection via NextAuth.js

## 🎨 UI/UX Features

### Notifications

- Success/error toast messages
- Form validation feedback
- Progress indicators

### Accessibility

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## 🔄 State Management

### Client State

- React Query for server state
- React Hook Form for form state
- Local component state for UI

### Server State

- API response caching
- Background refetching
- Optimistic updates
- Error boundaries

## 🚀 Development Patterns

### File Organization

- Feature-based folder structure
- Co-located components and hooks
- Shared components in `_components`
- Server actions in `_actions`

### Code Patterns

- Custom hooks for business logic
- Server actions for API calls
- Zod schemas for validation
- TypeScript for type safety

### Error Handling

- Try-catch blocks in server actions
- Error boundaries for components
- Toast notifications for user feedback
- Console logging for debugging

### Debug Tools

- Browser DevTools
- React Query DevTools
- NextAuth.js debug mode
- Console logging
