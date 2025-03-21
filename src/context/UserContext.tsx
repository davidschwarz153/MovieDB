/**
 * UserContext Component
 * 
 * This context manages user authentication, user data, and admin functionality.
 * It provides a centralized state management solution for user-related operations
 * including sign-up, login, user management, and persistent storage using localStorage.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserSignUpData } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * UserContextType Interface
 * Defines the shape of the context and available methods for user management
 */
interface UserContextType {
  users: User[];                                           // List of all registered users
  currentUser: User | null;                               // Currently logged in user
  createUser: (userData: UserSignUpData) => Promise<User>; // User registration
  updateUser: (id: string, userData: Partial<User>) => Promise<User>; // User data updates
  deleteUser: (id: string) => Promise<void>;              // User deletion
  getUser: (id: string) => User | undefined;              // Get specific user
  getAllUsers: () => User[];                              // Get all users
  login: (email: string, password: string) => Promise<User>; // User authentication
  logout: () => void;                                     // User logout
  isAdmin: boolean;                                       // Admin status flag
}

// Default admin credentials
const ADMIN_EMAIL = 'admin@moviedb.com';
const ADMIN_PASSWORD = 'admin123';

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider Component
 * Manages user state and provides user-related functionality to the application
 */
export function UserProvider({ children }: { children: ReactNode }) {
  // State management for users and authentication
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Initialize state from localStorage on component mount
   * Restores user session and data persistence
   */
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const storedCurrentUser = localStorage.getItem('currentUser');
    if (storedCurrentUser) {
      const user = JSON.parse(storedCurrentUser);
      setCurrentUser(user);
      setIsAdmin(user.email === ADMIN_EMAIL);
    }
  }, []);

  /**
   * Persist users data to localStorage when it changes
   */
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  /**
   * Persist current user to localStorage when it changes
   */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  /**
   * Creates a new user account
   * @param userData - User registration data
   * @returns Promise<User> - Newly created user object
   * @throws Error if email already exists
   */
  const createUser = async (userData: UserSignUpData): Promise<User> => {
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const now = new Date().toISOString();
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      role: userData.email === ADMIN_EMAIL ? 'admin' : 'user',
      createdAt: now,
      updatedAt: now,
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    return newUser;
  };

  /**
   * Updates an existing user's information
   * @param id - User ID to update
   * @param userData - Partial user data to update
   * @returns Promise<User> - Updated user object
   * @throws Error if user not found
   */
  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    const newUsers = [...users];
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);

    // Update current user if it's the same user
    if (currentUser?.id === id) {
      setCurrentUser(updatedUser);
    }

    return updatedUser;
  };

  /**
   * Deletes a user account
   * @param id - User ID to delete
   * @throws Error if user not found
   */
  const deleteUser = async (id: string): Promise<void> => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  };

  /**
   * Retrieves a specific user by ID
   * @param id - User ID to find
   * @returns User | undefined - Found user or undefined
   */
  const getUser = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  /**
   * Returns all registered users
   * @returns User[] - Array of all users
   */
  const getAllUsers = (): User[] => {
    return users;
  };

  /**
   * Authenticates a user or admin
   * @param email - User email
   * @param password - User password
   * @returns Promise<User> - Authenticated user object
   * @throws Error if credentials are invalid
   */
  const login = async (email: string, password: string): Promise<User> => {
    // Handle admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin',
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(adminUser);
      setIsAdmin(true);
      return adminUser;
    }

    // Handle regular user login
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    setCurrentUser(user);
    setIsAdmin(false);
    return user;
  };

  /**
   * Logs out the current user
   * Clears current user state and admin status
   */
  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        createUser,
        updateUser,
        deleteUser,
        getUser,
        getAllUsers,
        login,
        logout,
        isAdmin,
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
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 