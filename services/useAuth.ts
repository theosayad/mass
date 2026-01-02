import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, onAuthChange, type UserV1 } from './auth';

export const useAuth = () => {
  const [version, setVersion] = useState(0);
  useEffect(() => onAuthChange(() => setVersion((v) => v + 1)), []);

  return useMemo(() => {
    const user = getCurrentUser();
    return {
      user,
      isLoggedIn: Boolean(user),
      isAdmin: user?.role === 'admin',
    } as { user: UserV1 | null; isLoggedIn: boolean; isAdmin: boolean };
  }, [version]);
};

