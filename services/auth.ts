export type Role = 'admin' | 'editor';

export type PasswordHashV1 = {
  version: 1;
  saltB64: string;
  iterations: number;
  hashB64: string;
};

export type UserV1 = {
  id: string;
  username: string;
  role: Role;
  password: PasswordHashV1;
  churchIds: string[];
  createdAt: string;
};

type SessionV1 = {
  version: 1;
  userId: string;
};

const USERS_KEY = 'mtl_users_v1';
const SESSION_KEY = 'mtl_session_v1';

const b64encode = (bytes: ArrayBuffer) => {
  const chars = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(chars);
};

const b64decode = (text: string) => {
  const bin = atob(text);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
};

const randomId = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

const AUTH_EVENT = 'mtl-auth';
const dispatchAuthEvent = () => window.dispatchEvent(new Event(AUTH_EVENT));

export const onAuthChange = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === USERS_KEY || event.key === SESSION_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(AUTH_EVENT, callback);
  };
};

const loadUsersUnsafe = (): UserV1[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as UserV1[];
  } catch {
    return [];
  }
};

const saveUsers = (users: UserV1[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  dispatchAuthEvent();
};

const loadSessionUnsafe = (): SessionV1 | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionV1;
    if (!parsed || parsed.version !== 1 || typeof parsed.userId !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveSession = (session: SessionV1 | null) => {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  dispatchAuthEvent();
};

const normalizeUsername = (username: string) => username.trim().toLowerCase();

const deriveKey = async (password: string, salt: ArrayBuffer, iterations: number) => {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    baseKey,
    256,
  );
  return bits;
};

const hashPassword = async (password: string): Promise<PasswordHashV1> => {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const iterations = 150_000;
  const hash = await deriveKey(password, salt.buffer, iterations);
  return {
    version: 1,
    saltB64: b64encode(salt.buffer),
    iterations,
    hashB64: b64encode(hash),
  };
};

const verifyPassword = async (password: string, stored: PasswordHashV1) => {
  const hash = await deriveKey(password, b64decode(stored.saltB64), stored.iterations);
  return b64encode(hash) === stored.hashB64;
};

export const hasAdmin = () => loadUsersUnsafe().some((u) => u.role === 'admin');

export const getUsers = () => loadUsersUnsafe();

export const getCurrentUser = (): UserV1 | null => {
  const session = loadSessionUnsafe();
  if (!session) return null;
  const users = loadUsersUnsafe();
  return users.find((u) => u.id === session.userId) ?? null;
};

export const logout = () => saveSession(null);

export const login = async (username: string, password: string) => {
  const users = loadUsersUnsafe();
  const normalized = normalizeUsername(username);
  const user = users.find((u) => normalizeUsername(u.username) === normalized);
  if (!user) return { ok: false as const, error: 'Invalid username or password.' };
  const ok = await verifyPassword(password, user.password);
  if (!ok) return { ok: false as const, error: 'Invalid username or password.' };
  saveSession({ version: 1, userId: user.id });
  return { ok: true as const, user };
};

export const bootstrapAdmin = async (username: string, password: string) => {
  const users = loadUsersUnsafe();
  if (users.some((u) => u.role === 'admin')) {
    return { ok: false as const, error: 'An admin already exists on this device.' };
  }
  const normalized = normalizeUsername(username);
  if (!normalized) return { ok: false as const, error: 'Username is required.' };
  if (users.some((u) => normalizeUsername(u.username) === normalized)) {
    return { ok: false as const, error: 'Username is already taken.' };
  }
  if (password.length < 10) return { ok: false as const, error: 'Use a password of at least 10 characters.' };

  const user: UserV1 = {
    id: randomId(),
    username: username.trim(),
    role: 'admin',
    password: await hashPassword(password),
    churchIds: [],
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  saveSession({ version: 1, userId: user.id });
  return { ok: true as const, user };
};

export const createUser = async (input: { username: string; password: string; role: Role }) => {
  const users = loadUsersUnsafe();
  const normalized = normalizeUsername(input.username);
  if (!normalized) return { ok: false as const, error: 'Username is required.' };
  if (users.some((u) => normalizeUsername(u.username) === normalized)) {
    return { ok: false as const, error: 'Username is already taken.' };
  }
  if (input.password.length < 10) return { ok: false as const, error: 'Use a password of at least 10 characters.' };

  const user: UserV1 = {
    id: randomId(),
    username: input.username.trim(),
    role: input.role,
    password: await hashPassword(input.password),
    churchIds: [],
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return { ok: true as const, user };
};

export const updateUser = (userId: string, patch: Partial<Pick<UserV1, 'role' | 'churchIds' | 'username'>>) => {
  const users = loadUsersUnsafe();
  const next = users.map((u) => (u.id === userId ? { ...u, ...patch } : u));
  saveUsers(next);
};

export const resetUserPassword = async (userId: string, newPassword: string) => {
  if (newPassword.length < 10) return { ok: false as const, error: 'Use a password of at least 10 characters.' };
  const users = loadUsersUnsafe();
  const user = users.find((u) => u.id === userId);
  if (!user) return { ok: false as const, error: 'User not found.' };
  const next = users.map((u) => (u.id === userId ? { ...u, password: await hashPassword(newPassword) } : u));
  saveUsers(next);
  return { ok: true as const };
};

export const deleteUser = (userId: string) => {
  const users = loadUsersUnsafe();
  const next = users.filter((u) => u.id !== userId);
  saveUsers(next);
  const session = loadSessionUnsafe();
  if (session?.userId === userId) saveSession(null);
};

export const canEditChurch = (user: UserV1 | null, churchId: string) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.churchIds.includes(churchId);
};

