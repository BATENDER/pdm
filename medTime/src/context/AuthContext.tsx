
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define User Roles
export type UserRole = 'user' | 'caregiver' | 'admin' | null;

interface AuthState {
  userRole: UserRole;
  isLoading: boolean;
}

interface AuthContextProps extends AuthState {
  login: (role: UserRole) => Promise<void>; // Simplified login for now
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock credentials for demonstration
const MOCK_CREDENTIALS = {
  user: { username: 'user', password: 'password' },
  caregiver: { username: 'caregiver', password: 'password' },
  admin: { username: 'admin', password: 'password' },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check AsyncStorage for saved role on app start
    const loadUserRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem('userRole') as UserRole;
        if (savedRole) {
          setUserRole(savedRole);
        }
      } catch (e) {
        console.error('Failed to load user role from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserRole();
  }, []);

  const login = async (role: UserRole) => {
    // In a real app, you'd validate credentials against MOCK_CREDENTIALS or an API
    // For simplicity here, we just set the role directly.
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userRole', role || ''); // Store role
      setUserRole(role);
    } catch (e) {
      console.error('Failed to save user role to storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userRole'); // Remove role from storage
      setUserRole(null);
    } catch (e) {
      console.error('Failed to remove user role from storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

