/**
 * UserContext Component
 *
 * This context manages user authentication, user data, and admin functionality.
 * It provides a centralized state management solution for user-related operations
 * including sign-up, login, user management, and persistent storage using localStorage.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserSignUpData } from "../types/user";

/**
 * UserContextType Interface
 * Defines the shape of the context and available methods for user management
 */
interface UserContextType {
  user: User | null;
  users: User[];
  currentUser: User | null;
  isAdmin: boolean;
  createUser: (data: UserSignUpData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
}

// Default admin credentials
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin";

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider Component
 * Manages user state and provides user-related functionality to the application
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Initialize state from localStorage on component mount
   * Restores user session and data persistence
   */
  useEffect(() => {
    try {
      // Загружаем список всех пользователей
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      }

      // Загружаем текущего пользователя
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === "admin");
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
      localStorage.removeItem("users");
      localStorage.removeItem("currentUser");
    }
  }, []);

  /**
   * Persist users data to localStorage when it changes
   */
  useEffect(() => {
    try {
      // Сохраняем список пользователей
      localStorage.setItem("users", JSON.stringify(users));

      // Сохраняем персональные данные каждого пользователя
      users.forEach((user) => {
        const userKey = `user_${user.id}`;
        const userData = {
          favorites: user.favorites || [],
          avatar: user.avatar,
          settings: user.settings || {},
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      });
    } catch (error) {
      console.error("Error saving users to localStorage:", error);
    }
  }, [users]);

  /**
   * Persist current user to localStorage when it changes
   */
  useEffect(() => {
    try {
      if (user) {
        // Сохраняем основные данные текущего пользователя
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Сохраняем персональные данные текущего пользователя
        const userKey = `user_${user.id}`;
        const userData = {
          favorites: user.favorites || [],
          avatar: user.avatar,
          settings: user.settings || {},
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      } else {
        localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.error("Error saving current user to localStorage:", error);
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  /**
   * Creates a new user account
   * @param data - User registration data
   * @returns Promise<void> - No return value
   */
  const createUser = async (data: UserSignUpData) => {
    try {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        role: data.role || "user",
        status: data.status || "active",
        favorites: [],
        avatar: data.avatar,
        settings: {},
      };

      setUsers((prevUsers) => [...prevUsers, newUser]);

      // Сохраняем нового пользователя и его персональные данные
      try {
        localStorage.setItem("users", JSON.stringify([...users, newUser]));
        const userKey = `user_${newUser.id}`;
        const userData = {
          favorites: [],
          avatar: newUser.avatar,
          settings: {},
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      } catch (error) {
        console.error("Error saving new user to localStorage:", error);
      }
    } catch (error) {
      console.error("Error creating new user:", error);
      throw error;
    }
  };

  /**
   * Authenticates a user or admin
   * @param email - User email
   * @param password - User password
   * @returns Promise<void> - No return value
   * @throws Error if user not found or account is banned
   */
  const login = async (email: string, password: string) => {
    // Handle admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: "admin",
        name: "admin",
        email: ADMIN_EMAIL,
        role: "admin",
        status: "active",
        favorites: [],
      };
      console.log("Admin user data:", adminUser);
      setUser(adminUser);
      setIsAdmin(true);
      return;
    }

    // Handle regular user login
    const foundUser = users.find((u) => u.email === email);
    if (!foundUser) {
      throw new Error("User not found");
    }

    if (foundUser.status === "banned") {
      throw new Error("Account is banned");
    }

    console.log("Found user data:", foundUser);
    setUser(foundUser);
    setIsAdmin(false);
  };

  /**
   * Logs out the current user
   * Clears current user state and admin status
   */
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("currentUser");
  };

  /**
   * Updates an existing user's information
   * @param data - Partial user data to update
   * @returns Promise<void> - No return value
   * @throws Error if no user is logged in
   */
  const updateUser = async (data: Partial<User>) => {
    if (!user) throw new Error("No user logged in");

    try {
      const updatedUser = { ...user, ...data };
      console.log("Updating user data:", updatedUser);
      setUser(updatedUser);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      );

      // Сохраняем обновленные данные в localStorage
      try {
        // Обновляем основные данные пользователя
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        localStorage.setItem(
          "users",
          JSON.stringify(users.map((u) => (u.id === user.id ? updatedUser : u)))
        );

        // Обновляем персональные данные пользователя
        const userKey = `user_${user.id}`;
        const userData = {
          favorites: updatedUser.favorites || [],
          avatar: updatedUser.avatar,
          settings: updatedUser.settings || {},
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      } catch (error) {
        console.error("Error saving updated user to localStorage:", error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  /**
   * Deletes a user account
   * @param userId - User ID to delete
   * @returns Promise<void> - No return value
   * @throws Error if user not found
   */
  const deleteUser = async (userId: string) => {
    try {
      // Удаляем персональные данные пользователя
      localStorage.removeItem(`user_${userId}`);

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      if (user?.id === userId) {
        logout();
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
      throw error;
    }
  };

  /**
   * Bans a user account
   * @param userId - User ID to ban
   * @returns Promise<void> - No return value
   * @throws Error if user not found
   */
  const banUser = async (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, status: "banned" as const } : u
      )
    );
    if (user?.id === userId) {
      logout();
    }
  };

  /**
   * Unbans a user account
   * @param userId - User ID to unban
   * @returns Promise<void> - No return value
   * @throws Error if user not found
   */
  const unbanUser = async (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, status: "active" as const } : u
      )
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        currentUser: user,
        isAdmin,
        createUser,
        login,
        logout,
        updateUser,
        deleteUser,
        banUser,
        unbanUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/**
 * Custom hook for accessing UserContext
 * @returns UserContextType - User context value
 * @throws Error if used outside of UserProvider
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
