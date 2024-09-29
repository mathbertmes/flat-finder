export interface User{
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  role: string;
  favorites: string[];
  deleted: boolean;
}