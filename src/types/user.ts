export type UserRole = "user" | "admin";
export type UserStatus = "active" | "banned";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  favorites?: string[];
}

export interface UserSignUpData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
}

export interface AdminUser extends User {
  role: "admin";
}
