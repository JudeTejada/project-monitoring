import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? new URL('http://localhost:3000')
      : new URL(`https://${process.env.VERCEL_URL!}`)
});

export const { useSession } = createAuthClient();
