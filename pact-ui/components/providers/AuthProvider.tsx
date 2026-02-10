'use client';

import { AuthProvider as BaseAuthProvider } from '@/hooks/useAuth';
import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return <BaseAuthProvider>{children}</BaseAuthProvider>;
}

