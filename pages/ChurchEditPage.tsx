import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { LEBANON_CHURCHES } from '../data/mockData';
import { mergeChurch } from '../services/churchStore';
import {
  clearChurchOverride,
  saveChurchOverride,
  useChurchOverride,
  type ChurchOverride,
} from '../services/firebaseChurchOverrides';
import { useFirebaseAuth } from '../services/firebaseAuthStore';
import type { MassTime } from '../types';

type Props = { churchId: string };

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

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <label className="block space-y-1">
    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{props.label}</span>
    <textarea
      {...props}
      className={[
        'w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800',
        'outline-none focus:ring-2 focus:ring-blue-500 min-h-32',
        props.className ?? '',
      ].join(' ')}
    />
  </label>
);

const DAYS: MassTime['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const LANGS: MassTime['language'][] = ['Arabic', 'French', 'English', 'Latin', 'Syriac'];

export default function ChurchEditPage({ churchId }: Props) {
  const base = useMemo(() => LEBANON_CHURCHES.find((c) => c.id === churchId) ?? null, [churchId]);
  const { override } = useChurchOverride(churchId);
  const church = useMemo(() => (base ? mergeChurch(base, override ?? undefined) : null), [base, override]);
  const { isLoggedIn, isAdmin, profile, firebaseUser } = useFirebaseAuth();

  const canEdit = isAdmin || (isLoggedIn && (profile?.churchIds ?? []).includes(churchId));

  const [draft, setDraft] = useState<ChurchOverride>({});
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setDraft({
      name: override?.name,
      address: override?.address,
      description: override?.description,
      schedule: override?.schedule,
    });
  }, [override]);

  if (!base || !church) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
        <a href="#/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
          <ChevronLeft size={16} /> Back
        </a>
        <h1 className="mt-6 text-2xl font-serif font-bold">Church not found</h1>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
        <a href={`#/church/${churchId}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
          <ChevronLeft size={16} /> Back
        </a>
        <h1 className="mt-6 text-2xl font-serif font-bold">Sign in required</h1>
        <p className="mt-2 text-sm text-slate-600">Go to `#/admin` to sign in.</p>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
        <a href={`#/church/${churchId}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
          <ChevronLeft size={16} /> Back
        </a>
        <h1 className="mt-6 text-2xl font-serif font-bold">No access</h1>
        <p className="mt-2 text-sm text-slate-600">Ask an admin to grant you access to this church.</p>
      </div>
    );
  }

  const currentSchedule = (draft.schedule ?? church.schedule) as MassTime[];

  const onSave = async () => {
    setError(null);
    setNotice(null);
    if (!firebaseUser) {
      setError('Not signed in.');
      return;
    }
    const cleaned: ChurchOverride = {};
    if (draft.name && draft.name.trim() !== base.name) cleaned.name = draft.name.trim();
    if (draft.address && draft.address.trim() !== base.address) cleaned.address = draft.address.trim();
    if (typeof draft.description === 'string' && draft.description.trim() !== base.description) {
      cleaned.description = draft.description.trim();
    }
    if (draft.schedule) cleaned.schedule = draft.schedule;

    try {
      await saveChurchOverride(churchId, cleaned, firebaseUser.uid);
      setNotice('Saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.');
    }
  };

  const onClear = async () => {
    setError(null);
    setNotice(null);
    if (!window.confirm('Remove the Firebase override and revert to the base data?')) return;
    try {
      await clearChurchOverride(churchId);
      setNotice('Override cleared.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not clear override.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <a
            href={`#/church/${churchId}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700"
          >
            <ChevronLeft size={16} /> Back
          </a>
          <div className="flex items-center gap-2">
            {override && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                <Trash2 size={16} /> Clear override
              </button>
            )}
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {(error || notice) && (
          <div
            className={[
              'rounded-3xl border p-6',
              error ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900',
            ].join(' ')}
          >
            <p className="font-bold">{error ?? notice}</p>
          </div>
        )}

        <section className="bg-white rounded-3xl border border-slate-200 p-8">
          <h1 className="text-2xl font-serif font-bold text-slate-900">Edit: {church.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your changes are stored in Firestore `churchOverrides/{churchId}` and merged on top of the base data.
          </p>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <TextField
              label="Name"
              value={draft.name ?? church.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <TextField
              label="Address"
              value={draft.address ?? church.address}
              onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Description"
                value={draft.description ?? church.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">Mass times</h2>
              <p className="mt-1 text-sm text-slate-600">Add, edit, or remove times. Keep `time` consistent (e.g. 08:00).</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  schedule: [...(currentSchedule ?? []), { day: 'Sunday', time: '08:00', language: 'Arabic' }],
                }))
              }
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Add
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {(currentSchedule ?? []).map((m, idx) => (
              <div key={`${m.day}-${m.time}-${idx}`} className="rounded-3xl border border-slate-200 p-4 bg-slate-50/50">
                <div className="grid md:grid-cols-4 gap-3 items-end">
                  <label className="block space-y-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Day</span>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                      value={m.day}
                      onChange={(e) => {
                        const next = [...currentSchedule];
                        next[idx] = { ...next[idx], day: e.target.value as MassTime['day'] };
                        setDraft((d) => ({ ...d, schedule: next }));
                      }}
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                  <TextField
                    label="Time"
                    value={m.time}
                    onChange={(e) => {
                      const next = [...currentSchedule];
                      next[idx] = { ...next[idx], time: e.target.value };
                      setDraft((d) => ({ ...d, schedule: next }));
                    }}
                    placeholder="08:00"
                  />
                  <label className="block space-y-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Language</span>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                      value={m.language}
                      onChange={(e) => {
                        const next = [...currentSchedule];
                        next[idx] = { ...next[idx], language: e.target.value as MassTime['language'] };
                        setDraft((d) => ({ ...d, schedule: next }));
                      }}
                    >
                      {LANGS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = currentSchedule.filter((_, i) => i !== idx);
                        setDraft((d) => ({ ...d, schedule: next }));
                      }}
                      className="px-4 py-3 rounded-2xl text-sm font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 w-full"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="md:col-span-4">
                    <TextField
                      label="Note (optional)"
                      value={m.note ?? ''}
                      onChange={(e) => {
                        const next = [...currentSchedule];
                        const note = e.target.value.trim();
                        next[idx] = { ...next[idx], note: note ? note : undefined };
                        setDraft((d) => ({ ...d, schedule: next }));
                      }}
                      placeholder="e.g. summer schedule"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(currentSchedule ?? []).length === 0 && <p className="text-sm text-slate-600">No mass times.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

