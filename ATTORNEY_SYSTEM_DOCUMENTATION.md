## Overview

This document provides comprehensive technical documentation for the attorney management system. The system handles attorney requests, validations, approvals, and management with a focus on legal compliance and user experience.

## Architecture

The attorney system is built on **Next.js 15** with server actions, React Query for state management, and Zod validation. It integrates with a backend API to manage attorney requests, validations, and approvals.

### Core Components

- **Next.js App Router**: File-based routing and server components
- **Server Actions**: API communication and data mutations
- **React Query**: Client-side state management and caching
- **Zod Validation**: Runtime type checking and form validation
- **PDF Handling**: File upload and management for attorney documents
- **Table Management**: Pagination, filtering, and data display

## Folder Structure

```
src/app/(routes)/(firstSystem)/attorney/
├── add/                              # Add new attorney
│   ├── _actions/
│   │   └── add-attorney.ts           # Server action for adding attorney
│   ├── _components/
│   │   ├── add-attorney-form.tsx     # Main form component
│   │   └── attorney-validation-result.tsx # Validation result display
│   ├── _hooks/
│   │   └── use-add-attorney.ts       # Add attorney hook
│   └── page.tsx                      # Add attorney page
│
├── attorney-management/              # Admin attorney management
│   ├── [attorneyId]/                 # Individual attorney details
│   │   ├── _components/
│   │   │   ├── attorney-details.tsx  # Attorney details display
│   │   │   ├── attorney-details-skeleton.tsx # Loading skeleton
│   │   │   ├── page-content.tsx      # Page content wrapper
│   │   │   └── request-timeline.tsx  # Request timeline component
│   │   └── page.tsx                  # Attorney details page
│   ├── _actions/
│   │   └── revoke-attorney.action.ts # Revoke attorney action
│   ├── _components/
│   │   ├── attorney-table.tsx        # Management table
│   │   └── revoke-dialog.tsx         # Revoke confirmation dialog
│   └── page.tsx                      # Management page
│
├── my-attorneies/                    # User's attorneys
│   ├── [attorneyId]/                 # Individual attorney view
│   │   ├── _components/
│   │   │   ├── my-attorney-details.tsx # User attorney details
│   │   │   ├── my-attorney-details-skeleton.tsx # Loading skeleton
│   │   │   └── page-content.tsx      # Page content wrapper
│   │   └── page.tsx                  # Attorney details page
│   ├── _components/
│   │   ├── attorney-table.tsx        # User attorney table
│   │   ├── name-filter.tsx           # Client/company filter
│   │   ├── revoke-button.tsx         # Revoke button component
│   │   └── status-filter.tsx         # Status filter component
│   └── page.tsx                      # User attorneys page
│
├── request/                          # Attorney request creation
│   ├── _actions/
│   │   └── add-attorney.action.ts    # Create attorney request
│   ├── _components/
│   │   ├── add-attorney.tsx          # Request form wrapper
│   │   └── add-form.tsx              # Main request form
│   ├── _hooks/
│   │   └── use-add-attorney.ts       # Request creation hook
│   └── page.tsx                      # Request page
│
├── revoke/                           # Attorney revocation
│   ├── _actions/
│   │   └── revoke-attorney.ts        # Revoke attorney action
│   ├── _components/
│   │   └── revoke-attorney-form.tsx  # Revoke form
│   ├── _hooks/
│   │   └── use-revoke-attorney.ts    # Revoke hook
│   └── page.tsx                      # Revoke page
│
└── verify/                           # Attorney verification
    ├── _actions/
    │   └── validate-attorney.ts      # Validate attorney action
    ├── _components/
    │   ├── attorney-result.tsx       # Validation result
    │   └── validate-attorney-form.tsx # Validation form
    ├── _hooks/
    │   └── use-attorney-validation.ts # Validation hook
    └── page.tsx                      # Verify page
```

## Attorney System Flows

### 1. Attorney Request Flow

**Path**: `/attorney/request`

**Process**:

1. **Form Selection**:

   - User selects client type (Individual/Company)
   - Chooses specific client or company
   - Selects attorney capacity (Self-representation/Lawyer)
   - Picks attorney types from categories
   - Sets duration (3/6/9 months or 1 year)
   - Adds optional notes

2. **Form Validation**:

   - Client-side validation with Zod
   - Real-time error feedback
   - Required field validation

3. **Request Submission**:
   - API call to create attorney request
   - Success notification
   - Redirect to management page

### 2. Add Attorney Flow

**Path**: `/attorney/add`

**Process**:

1. **Attorney Number Validation**:

   - User enters attorney number
   - System validates number format
   - Shows validation result

2. **Client Selection**:

   - Choose client type (Individual/Company)
   - Select specific client
   - Upload attorney PDF document

3. **Document Upload**:

   - PDF file validation (max 5MB)
   - File type verification
   - Secure upload handling

4. **Attorney Addition**:
   - FormData submission to API
   - Success confirmation
   - Redirect to attorney list

### 3. Attorney Verification Flow

**Path**: `/attorney/verify`

**Process**:

1. **Number Input**:

   - User enters attorney number
   - Format validation (numbers only)
   - Security validation (no code injection)

2. **API Validation**:

   - Server-side verification
   - Attorney details retrieval
   - Status checking

3. **Result Display**:
   - Attorney information display
   - Status and validity confirmation
   - Download options if available

### 4. Attorney Revocation Flow

**Path**: `/attorney/revoke`

**Process**:

1. **Attorney Identification**:

   - Enter attorney number
   - Format validation
   - Number verification

2. **Reason Specification**:

   - Provide revocation reason
   - Minimum 10 characters required
   - Maximum 500 characters
   - Security validation

3. **Revocation Processing**:
   - API call to revoke attorney
   - Success confirmation
   - Status update

## 🔧 Technical Implementation

### API Integration

**File**: `src/lib/api/attorney.api.ts`

**Endpoints**:

1. **Attorney Categories**: `/Attorney/list-main-categories`
2. **All Attorney Requests**: `/Attorney/list-my-attorney-requests`
3. **Attorney Request Details**: `/Attorney/get-attorney-request-details`
4. **User Attorneys**: `/Attorney/list-my-attorneys`
5. **User Attorney Details**: `/Attorney/get-attorney-details/{id}`
6. **Add Attorney**: `/Attorney/add-attorney`
7. **Validate Attorney**: `/Attorney/validate-attorney`
8. **Revoke Attorney**: `/Attorney/revoke-attorney`

### Server Actions

**Key Server Actions**:

1. **Add Attorney** (`add-attorney.ts`):

   - Handles FormData submission
   - PDF file processing
   - Authentication header management

2. **Create Attorney Request** (`add-attorney.action.ts`):

   - Validates request data
   - API communication
   - Error handling

3. **Validate Attorney** (`validate-attorney.ts`):

   - Attorney number validation
   - API verification
   - Result processing

4. **Revoke Attorney** (`revoke-attorney.ts`):
   - Revocation processing
   - Reason validation
   - Status updates

### React Query Integration

**Custom Hooks**:

1. **useAddAttorney**: Add attorney functionality
2. **useAttorneyValidation**: Attorney validation
3. **useRevokeAttorney**: Attorney revocation
4. **useAttorneyRequest**: Request creation

**Features**:

- Optimistic updates
- Error handling
- Loading states
- Success notifications
- Cache management

## 🛡️ Security Features

### Input Validation

**Client-Side Validation**:

- Zod schema validation
- Real-time error feedback
- Required field checking
- Format validation

**Server-Side Validation**:

- API-level validation
- Authentication verification
- File type validation
- Size limits

### Security Measures

**Code Injection Prevention**:

```typescript
const noCodeRegex =
  /[<>]|script|onerror|onload|SELECT|UPDATE|DELETE|INSERT|DROP|--|;/i;
```

**File Upload Security**:

- PDF type validation
- Size limits (5MB max)
- Secure file handling
- Content verification

**Authentication**:

- JWT token validation
- Authorization headers
- Session management
- Route protection

## 🎨 UI/UX Features

### Form Components

**Add Attorney Form**:

- Multi-step validation
- Client type selection
- File upload with preview
- Real-time validation feedback

**Request Form**:

- Dynamic attorney type selection
- Category-based filtering
- Duration selection
- Notes field

**Validation Form**:

- Simple number input
- Instant validation
- Clear error messages
- Result display

### Table Management

**Attorney Management Table**:

- Pagination support
- Status filtering
- Search functionality
- Action buttons

**User Attorney Table**:

- Client/company filtering
- Status filtering
- Date range display
- Revoke functionality

### Notifications

**Success Messages**:

- Attorney added successfully
- Request created successfully
- Validation completed
- Revocation successful

**Error Handling**:

- Clear error messages
- Arabic language support
- User-friendly feedback
- Debug information

## 🔄 State Management

### Client State

**React Query**:

- API call caching
- Background refetching
- Optimistic updates
- Error boundaries

**Form State**:

- React Hook Form
- Real-time validation
- Field-level errors
- Form submission handling

**UI State**:

- Loading states
- Modal management
- Filter states
- Pagination state

### Server State

**API Responses**:

- Attorney data caching
- Category caching
- Client/company data
- Pagination metadata

**Real-time Updates**:

- Path revalidation
- Cache invalidation
- Optimistic updates
- Background sync

## 🚀 Development Patterns

### File Organization

**Feature-Based Structure**:

- Co-located components
- Shared hooks
- Server actions
- Type definitions

**Component Patterns**:

- Reusable form components
- Table builders
- Modal dialogs
- Loading states

### Code Patterns

**Custom Hooks**:

- Business logic separation
- Reusable functionality
- Error handling
- Loading management

**Server Actions**:

- API communication
- Error handling
- Authentication
- Data transformation

**Type Safety**:

- TypeScript throughout
- Zod validation
- API type definitions
- Component props

### Error Handling

**Client-Side**:

- Form validation errors
- Network error handling
- User-friendly messages
- Toast notifications

**Server-Side**:

- API error handling
- Authentication errors
- File upload errors
- Validation errors

## 📊 Data Models

### Attorney Types

**AttorneyCategory**:

```typescript
{
  id: number;
  name: string;
  parentName: string | null;
  parentId: number | null;
  children: AttorneyCategory[];
  createdAt: string;
  updatedAt: string;
}
```

**Attorney**:

```typescript
{
  id: number;
  clientName: string;
  attorneyMainType: string;
  createdAtFormatted: string;
  status: "sent_to_client" |
    "pending" |
    "approved" |
    "rejected" |
    "in_progress";
  createdDay: number;
  createdMonth: string;
  createdYear: number;
}
```

**UserAttorney**:

```typescript
{
  id: number;
  attorneyNumber: number;
  clientName: string;
  attorneyStatus: "منتهية" | "معتمدة" | "مفسوخة كلياً";
  issueDate: string;
  expiryDate: string;
}
```

### Form Schemas

**AttorneyRequestSchema**:

- Client type validation
- Client ID validation
- Attorney capacity validation
- Attorney type validation
- Duration validation
- Optional notes

**AddAttorneySchema**:

- Attorney number validation
- Client type validation
- Client ID validation
- PDF file validation

**RevokeAttorneySchema**:

- Attorney number validation
- Rejection reason validation
- Character limits
- Security validation

## 🔍 API Endpoints

### Attorney Management

**GET** `/Attorney/list-main-categories`

- Returns attorney categories
- Cached for 10 minutes
- Requires authentication

**GET** `/Attorney/list-my-attorney-requests`

- Returns user's attorney requests
- Supports pagination and filtering
- No cache (real-time data)

**GET** `/Attorney/get-attorney-request-details?id={id}`

- Returns specific attorney request details
- Cached for 10 minutes
- Requires authentication

### User Attorneys

**GET** `/Attorney/list-my-attorneys`

- Returns user's attorneys
- Supports pagination and filtering
- No cache (real-time data)

**GET** `/Attorney/get-attorney-details/{id}`

- Returns specific attorney details
- Cached for 10 minutes
- Requires authentication

### Attorney Operations

**POST** `/Attorney/add-attorney`

- Adds new attorney
- Requires FormData with PDF
- Returns success/error response

**POST** `/Attorney/validate-attorney`

- Validates attorney number
- Returns attorney details
- Requires authentication

**POST** `/Attorney/revoke-attorney`

- Revokes attorney
- Requires reason
- Updates status

## 🛠️ Development Tools

### Debugging

**Console Logging**:

- API call logging
- Error logging
- Success confirmations
- Debug information

**React Query DevTools**:

- Query state inspection
- Cache management
- Network monitoring
- Performance analysis

### Testing

**Unit Tests**:

- Component testing
- Hook testing
- Utility function testing
- Schema validation testing

**Integration Tests**:

- API integration testing
- Form submission testing
- Error handling testing
- User flow testing

### Performance

**Optimization**:

- Image optimization
- Code splitting
- Lazy loading
- Caching strategies

**Monitoring**:

- API response times
- Error rates
- User interactions
- Performance metrics

---

This documentation provides a comprehensive guide to understanding and maintaining the attorney management system. Each component is designed to work seamlessly with the others while maintaining security, performance, and user experience.
