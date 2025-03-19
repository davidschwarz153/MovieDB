import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    // Проверяем учетные данные admin/admin
    if (email === "admin" && password === "admin") {
      const newUser = {
        id: "admin_user",
        name: "Admin",
        email,
        password,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return;
    }

    // Получаем список всех пользователей
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Ищем пользователя по email и паролю
    const foundUser = users.find(
      (u: User) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return;
    }

    throw new Error("Invalid credentials");
  };

  const register = async (email: string, password: string, name: string) => {
    // Получаем список всех пользователей
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Проверяем, не существует ли уже пользователь с таким email
    if (users.some((u: User) => u.email === email)) {
      throw new Error("User with this email already exists");
    }

    // Создаем нового пользователя
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
    };

    // Добавляем пользователя в список
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Автоматически входим после регистрации
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Обновляем данные пользователя в списке всех пользователей
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: User) =>
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
