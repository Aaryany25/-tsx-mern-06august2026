import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  mockLogin,
  mockSilentRefresh,
  decodeJWT,
  isTokenExpired,
  type AuthTokens,
} from '../services/mockAuth';

interface User {
  id: string;
  username: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  secondsUntilExpiry: number;
  lastRefreshNotice: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('swapi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('swapi_access_token');
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('swapi_refresh_token');
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [secondsUntilExpiry, setSecondsUntilExpiry] = useState<number>(0);
  const [lastRefreshNotice, setLastRefreshNotice] = useState<string | null>(null);

  // Perform Silent Token Refresh
  const performSilentRefresh = useCallback(async () => {
    if (!refreshToken || !user || isRefreshing) return;

    setIsRefreshing(true);
    try {
      const tokens = await mockSilentRefresh(refreshToken, user.username);
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      localStorage.setItem('swapi_access_token', tokens.accessToken);
      localStorage.setItem('swapi_refresh_token', tokens.refreshToken);

      const timeStr = new Date().toLocaleTimeString();
      setLastRefreshNotice(`Token refreshed silently at ${timeStr}`);
      
      // Auto-hide notice after 4 seconds
      setTimeout(() => {
        setLastRefreshNotice(null);
      }, 4000);
    } catch (err) {
      console.error('Silent refresh failed:', err);
      // Logout if refresh fails
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('swapi_user');
      localStorage.removeItem('swapi_access_token');
      localStorage.removeItem('swapi_refresh_token');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshToken, user, isRefreshing]);

  // Login handler
  const login = async (username: string, password: string) => {
    const tokens: AuthTokens = await mockLogin(username, password);
    setUser(tokens.user);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);

    localStorage.setItem('swapi_user', JSON.stringify(tokens.user));
    localStorage.setItem('swapi_access_token', tokens.accessToken);
    localStorage.setItem('swapi_refresh_token', tokens.refreshToken);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('swapi_user');
    localStorage.removeItem('swapi_access_token');
    localStorage.removeItem('swapi_refresh_token');
    setLastRefreshNotice(null);
  };

  // Countdown timer & automatic silent refresh trigger
  useEffect(() => {
    if (!accessToken || !user) {
      setSecondsUntilExpiry(0);
      return;
    }

    const interval = setInterval(() => {
      const decoded = decodeJWT(accessToken);
      if (!decoded) {
        setSecondsUntilExpiry(0);
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, decoded.exp - now);
      setSecondsUntilExpiry(remaining);

      // Trigger silent refresh when 8 seconds or less remain
      if (remaining <= 8 && !isRefreshing && refreshToken) {
        performSilentRefresh();
      }

      // If token expired and silent refresh didn't run, force logout
      if (remaining === 0 && isTokenExpired(accessToken, 0)) {
        logout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [accessToken, user, isRefreshing, refreshToken, performSilentRefresh]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isRefreshing,
        secondsUntilExpiry,
        lastRefreshNotice,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
