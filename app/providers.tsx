'use client';

import { ThemeProvider } from '@/src/contexts/theme-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
