/**
 * UserContext Component
 *
 * This context manages user authentication, user data, and admin functionality.
 * It provides a centralized state management solution for user-related operations
 * including sign-up, login, user management, and persistent storage using localStorage.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserSignUpData } from "../types/user";
import { v4 as uuidv4 } from "uuid";

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
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /**
   * Persist users data to localStorage when it changes
   */
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  /**
   * Persist current user to localStorage when it changes
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  /**
   * Creates a new user account
   * @param data - User registration data
   * @returns Promise<void> - No return value
   */
  const createUser = async (data: UserSignUpData) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      role: data.role || "user",
      status: data.status || "active",
      favorites: [],
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    return;
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

    const updatedUser = { ...user, ...data };
    console.log("Updating user data:", updatedUser);
    setUser(updatedUser);

    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
    );
  };

  /**
   * Deletes a user account
   * @param userId - User ID to delete
   * @returns Promise<void> - No return value
   * @throws Error if user not found
   */
  const deleteUser = async (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    if (user?.id === userId) {
      logout();
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
