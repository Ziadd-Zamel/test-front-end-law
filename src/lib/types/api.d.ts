// ============================================
// API Types (types/api.ts or lib/types/api.ts)
// ============================================

declare type ErrorResponse = {
  success: false;
  message?: string;
};

declare type SuccessfulResponse<T> = {
  success: true;
  message: string;
  data: T;
  pagination: Pagination;
};

declare type Pagination = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

declare type APIResponse<T> = SuccessfulResponse<T> | ErrorResponse;

export type NewLoginResponse = {
  message: string;
  token: string;
  refreshToken: string;
};

export type ApplicationUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  photo?: string;
  role: string;
  wishlist: string[];
  addresses: string[];
  createdAt: string;
};

// ⭐ UPDATED BASED ON NEW BACKEND RESPONSE
export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    type: string; // replaces typeUser
    roles: string[]; // replaces role
    verify: boolean;
  };
};

export type DataBaseProbs = {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

// ⭐ UPDATED USER PROFILE TYPE (if your profile matches old API keep this)
export type UserData = {
  dateOfBirth: string;
  email: string;
  emailConfirmed: boolean;
  fullName: string;
  id: number;
  identity: string;
  isActive: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  permissions: { id: number; name: string }[];
};
