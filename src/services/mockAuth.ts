// Mock JWT authentication service with Base64 JSON JWT simulation

export interface DecodedToken {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    role: string;
    avatar: string;
  };
}

// Simple Base64 URL helper for JWT simulation
const base64UrlEncode = (str: string): string => {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
};

export const generateMockJWT = (
  username: string,
  role: string = 'Jedi Master',
  expiresInSeconds: number = 30 // 30 seconds for quick silent refresh demonstration
): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: DecodedToken = {
    sub: 'user_123',
    username,
    role,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const mockSignature = base64UrlEncode(`mock_signature_${Date.now()}`);

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

export const decodeJWT = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decodedStr = base64UrlDecode(parts[1]);
    return JSON.parse(decodedStr) as DecodedToken;
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
};

export const isTokenExpired = (token: string, bufferSeconds: number = 5): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp - now <= bufferSeconds;
};

// Mock Authentication API calls
export const mockLogin = async (username: string, password: string): Promise<AuthTokens> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Allow any demo credentials or check demo password
      if (!username.trim() || !password.trim()) {
        reject(new Error('Username and password are required'));
        return;
      }

      if (password !== 'force123' && password !== 'password' && password !== 'admin') {
        reject(new Error('Invalid password! Use demo password: force123'));
        return;
      }

      const accessToken = generateMockJWT(username, 'Jedi Master', 30);
      const refreshToken = `mock_refresh_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      resolve({
        accessToken,
        refreshToken,
        user: {
          id: 'user_123',
          username,
          role: 'Jedi Master',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        },
      });
    }, 600);
  });
};

export const mockSilentRefresh = async (currentRefreshToken: string, username: string): Promise<{ accessToken: string; refreshToken: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentRefreshToken) {
        reject(new Error('Invalid refresh token'));
        return;
      }

      // Generate fresh 30-second Access Token
      const newAccessToken = generateMockJWT(username, 'Jedi Master', 30);
      const newRefreshToken = `mock_refresh_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      resolve({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }, 400);
  });
};
