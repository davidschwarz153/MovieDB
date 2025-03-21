export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  favorites?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSignUpData {
  name: string;
  email: string;
  password: string;
} 