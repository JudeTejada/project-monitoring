import { createAuthClient } from 'better-auth/react';

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  // Check for VERCEL_URL first, then fall back to window.location.origin
  if (typeof window === 'undefined') {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return window.location.origin;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl()
});

export const { useSession } = createAuthClient();
