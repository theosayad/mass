import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'admin' }
  | { name: 'church'; churchId: string }
  | { name: 'churchEdit'; churchId: string }
  | { name: 'notFound' };

const normalizeHash = (hash: string) => {
  if (!hash || hash === '#') return '#/';
  if (!hash.startsWith('#')) return `#${hash}`;
  return hash;
};

export const parseRoute = (hash: string): Route => {
  const normalized = normalizeHash(hash);
  const path = normalized.slice(1); // remove "#"
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'admin') return { name: 'admin' };
  if (parts[0] === 'church' && typeof parts[1] === 'string') {
    if (parts[2] === 'edit') return { name: 'churchEdit', churchId: parts[1] };
    return { name: 'church', churchId: parts[1] };
  }
  return { name: 'notFound' };
};

export const navigate = (to: string) => {
  window.location.hash = to.startsWith('#') ? to : `#${to}`;
};

export const useRoute = () => {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
};
