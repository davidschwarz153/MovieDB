export type UserRole = "user" | "admin";
export type UserStatus = "active" | "banned";

export interface UserSettings {
  theme?: string;
  language?: string;
  notifications?: boolean;
  [key: string]: any; // Для дополнительных пользовательских настроек
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  favorites?: string[];
  settings?: UserSettings;
}

export interface UserSignUpData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
  settings?: UserSettings;
}

export interface AdminUser extends User {
  role: "admin";
}
