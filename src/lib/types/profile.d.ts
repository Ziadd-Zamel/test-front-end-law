declare type UserData = {
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
