export interface User{
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  role: string;
  favorites: string[];
  deleted: boolean;
  flatsCounter: number;
}