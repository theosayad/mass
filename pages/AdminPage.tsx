import React, { useMemo, useState } from 'react';
import { Church } from '../types';
import { getChurches } from '../services/churchStore';
import {
  bootstrapAdmin,
  canEditChurch,
  createUser,
  deleteUser,
  getUsers,
  hasAdmin,
  login,
  logout,
  resetUserPassword,
  updateUser,
  type Role,
  type UserV1,
} from '../services/auth';
import { useAuth } from '../services/useAuth';
import { navigate } from '../services/router';

const TextField = (props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="block space-y-1">
    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{props.label}</span>
    <input
      {...props}
      className={[
        'w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800',
        'outline-none focus:ring-2 focus:ring-blue-500',
        props.className ?? '',
      ].join(' ')}
    />
  </label>
);

const SelectField = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => (
  <label className="block space-y-1">
    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{props.label}</span>
    <select
      {...props}
      className={[
        'w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800',
        'outline-none focus:ring-2 focus:ring-blue-500',
        props.className ?? '',
      ].join(' ')}
    />
  </label>
);

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const churches = useMemo(() => getChurches(), []);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [bootstrapUsername, setBootstrapUsername] = useState('theo');
  const [bootstrapPassword, setBootstrapPassword] = useState('');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<Role>('editor');

  const [userSearch, setUserSearch] = useState('');
  const [churchSearch, setChurchSearch] = useState('');

  const users = getUsers();
  const adminExists = hasAdmin();

  const visibleChurches = useMemo(() => {
    const q = churchSearch.trim().toLowerCase();
    if (!q) return churches;
    return churches.filter((c) => `${c.name} ${c.city} ${c.district} ${c.rite}`.toLowerCase().includes(q));
  }, [churchSearch, churches]);

  const visibleUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q) || u.role.includes(q));
  }, [userSearch, users]);

  const onLogout = () => {
    logout();
    setNotice('Logged out.');
    setError(null);
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const res = await login(loginUsername, loginPassword);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setNotice(`Welcome, ${res.user.username}.`);
    setLoginPassword('');
  };

  const onBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const res = await bootstrapAdmin(bootstrapUsername, bootstrapPassword);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setNotice('Admin created and logged in.');
    setBootstrapPassword('');
  };

  const onCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!isAdmin) {
      setError('Admin access required.');
      return;
    }
    const res = await createUser({ username: newUsername, password: newPassword, role: newRole });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setNotice(`Created ${res.user.username}.`);
    setNewUsername('');
    setNewPassword('');
  };

  const toggleChurchAccess = (targetUser: UserV1, churchId: string) => {
    const next = targetUser.churchIds.includes(churchId)
      ? targetUser.churchIds.filter((id) => id !== churchId)
      : [...targetUser.churchIds, churchId];
    updateUser(targetUser.id, { churchIds: next });
    setNotice('Permissions updated.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white font-black">MT</div>
            <div>
              <h1 className="text-lg font-serif font-bold text-blue-900 leading-tight">Admin</h1>
              <p className="text-xs text-slate-500">Local (device-only) permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#/" className="px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              Back
            </a>
            {user && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {(error || notice) && (
          <div
            className={[
              'rounded-3xl border p-6',
              error ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900',
            ].join(' ')}
          >
            <p className="font-bold">{error ?? notice}</p>
            <p className="text-sm mt-1 opacity-80">
              This admin system stores users and permissions in your browser localStorage (not a server).
            </p>
          </div>
        )}

        {!adminExists ? (
          <section className="bg-white rounded-3xl border border-slate-200 p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Create Admin (first time)</h2>
            <p className="mt-2 text-slate-600 text-sm">
              This creates the admin account on this device only. Choose a strong password.
            </p>
            <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={onBootstrap}>
              <TextField
                label="Admin Username"
                value={bootstrapUsername}
                onChange={(e) => setBootstrapUsername(e.target.value)}
                autoComplete="username"
              />
              <TextField
                label="Admin Password"
                type="password"
                value={bootstrapPassword}
                onChange={(e) => setBootstrapPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 10 characters"
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Create Admin
                </button>
                <button
                  type="button"
                  onClick={() => navigate('#/')}
                  className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            {!user ? (
              <section className="bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Login</h2>
                <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={onLogin}>
                  <TextField
                    label="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    autoComplete="username"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </section>
            ) : !isAdmin ? (
              <section className="bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Admin access required</h2>
                <p className="mt-2 text-slate-600 text-sm">
                  You are logged in as <span className="font-bold">{user.username}</span>. Ask an admin to grant access.
                </p>
                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-6 px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Logout
                </button>
              </section>
            ) : (
              <>
                <section className="bg-white rounded-3xl border border-slate-200 p-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-slate-900">Users</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Create users and grant them access to specific churches.
                      </p>
                    </div>
                    <div className="w-full md:w-72">
                      <TextField
                        label="Search Users"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="e.g. editor"
                      />
                    </div>
                  </div>

                  <form className="mt-6 grid md:grid-cols-3 gap-4" onSubmit={onCreateUser}>
                    <TextField label="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                    <TextField
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 10 characters"
                    />
                    <SelectField label="Role" value={newRole} onChange={(e) => setNewRole(e.target.value as Role)}>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </SelectField>
                    <div className="md:col-span-3">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                      >
                        Create User
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 space-y-4">
                    {visibleUsers.map((u) => (
                      <div key={u.id} className="rounded-3xl border border-slate-200 p-6 bg-slate-50/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <p className="text-lg font-bold text-slate-900">{u.username}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{u.role}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm font-bold hover:border-blue-300 hover:text-blue-700 transition-colors"
                              onClick={async () => {
                                const pw = window.prompt(`Set a new password for ${u.username} (min 10 chars):`);
                                if (!pw) return;
                                const res = await resetUserPassword(u.id, pw);
                                if (!res.ok) setError(res.error);
                                else setNotice('Password updated.');
                              }}
                            >
                              Reset Password
                            </button>
                            <button
                              type="button"
                              className="px-4 py-2 rounded-2xl bg-white border border-rose-200 text-sm font-bold text-rose-700 hover:bg-rose-50 transition-colors"
                              onClick={() => {
                                if (u.id === user.id) {
                                  setError('You cannot delete your own user.');
                                  return;
                                }
                                if (!window.confirm(`Delete user ${u.username}?`)) return;
                                deleteUser(u.id);
                                setNotice('User deleted.');
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 grid md:grid-cols-2 gap-4 items-end">
                          <SelectField
                            label="Role"
                            value={u.role}
                            onChange={(e) => updateUser(u.id, { role: e.target.value as Role })}
                          >
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </SelectField>
                          <div className="text-sm text-slate-600">
                            <p className="font-bold text-slate-800">Church access</p>
                            <p className="text-xs text-slate-500">
                              Admins can edit all churches. Editors need explicit assignment.
                            </p>
                          </div>
                        </div>

                        {u.role !== 'admin' && (
                          <div className="mt-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                              <div className="w-full md:w-96">
                                <TextField
                                  label="Search Churches"
                                  value={churchSearch}
                                  onChange={(e) => setChurchSearch(e.target.value)}
                                  placeholder="name, city, rite…"
                                />
                              </div>
                              <div className="text-xs text-slate-500">
                                Selected: <span className="font-bold">{u.churchIds.length}</span>
                              </div>
                            </div>

                            <div className="mt-4 max-h-[360px] overflow-auto rounded-3xl border border-slate-200 bg-white">
                              <ul className="divide-y divide-slate-100">
                                {visibleChurches.map((c: Church) => {
                                  const checked = canEditChurch(u, c.id);
                                  return (
                                    <li key={c.id} className="p-4 flex items-center justify-between gap-4">
                                      <div className="min-w-0">
                                        <p className="font-bold text-slate-900 truncate">{c.name}</p>
                                        <p className="text-xs text-slate-500 truncate">
                                          {c.city} • {c.district} • {c.rite}
                                        </p>
                                      </div>
                                      <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => toggleChurchAccess(u, c.id)}
                                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        Access
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-3xl border border-slate-200 p-8">
                  <h2 className="text-xl font-serif font-bold text-slate-900">Quick actions</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                      onClick={() => navigate('#/')}
                    >
                      Open directory
                    </button>
                    <button
                      type="button"
                      className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                      onClick={() => {
                        const exportObj = { users: getUsers() };
                        navigator.clipboard
                          .writeText(JSON.stringify(exportObj, null, 2))
                          .then(() => setNotice('Copied users JSON to clipboard.'))
                          .catch(() => setError('Could not copy to clipboard.'));
                      }}
                    >
                      Copy users JSON
                    </button>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

