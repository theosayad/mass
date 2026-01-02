import React, { useMemo } from 'react';
import { MapPin, Pencil, ChevronLeft } from 'lucide-react';
import { LEBANON_CHURCHES } from '../data/mockData';
import { mergeChurch } from '../services/churchStore';
import { useChurchOverride } from '../services/firebaseChurchOverrides';
import { useFirebaseAuth } from '../services/firebaseAuthStore';

type Props = { churchId: string };

export default function ChurchPage({ churchId }: Props) {
  const base = useMemo(() => LEBANON_CHURCHES.find((c) => c.id === churchId) ?? null, [churchId]);
  const { override } = useChurchOverride(churchId);
  const church = useMemo(() => (base ? mergeChurch(base, override ?? undefined) : null), [base, override]);
  const { isLoggedIn, isAdmin, profile } = useFirebaseAuth();

  const canEdit =
    isAdmin || (isLoggedIn && (profile?.churchIds ?? []).includes(churchId) && (profile?.role ?? 'editor') !== 'admin');

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <a href="#/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
            <ChevronLeft size={16} /> Directory
          </a>
          <div className="flex items-center gap-2">
            {canEdit && (
              <a
                href={`#/church/${churchId}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                <Pencil size={16} /> Edit
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <section className="bg-white rounded-3xl border border-slate-200 p-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900">{church.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {church.city} • {church.district} • {church.rite}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 font-semibold">
              <MapPin size={16} />
              {church.address}
            </span>
          </div>
          {church.description && <p className="mt-6 text-slate-700 leading-relaxed">{church.description}</p>}
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-serif font-bold text-slate-900">Mass Times</h2>
            {override && <span className="text-xs font-black uppercase tracking-widest text-blue-700">Updated</span>}
          </div>

          {church.schedule.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No mass times listed yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100 rounded-3xl border border-slate-200 overflow-hidden">
              {church.schedule.map((m, idx) => (
                <li key={`${m.day}-${m.time}-${idx}`} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white">
                  <div className="font-bold text-slate-900">
                    {m.day} — {m.time}
                  </div>
                  <div className="text-sm text-slate-600">
                    {m.language}
                    {m.note ? <span className="text-slate-500"> • {m.note}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {!isLoggedIn && (
          <section className="bg-amber-50 rounded-3xl border border-amber-200 p-6 text-amber-900">
            <p className="font-bold">Sign in to edit</p>
            <p className="mt-1 text-sm opacity-80">If you have church access, go to `#/admin` to sign in.</p>
          </section>
        )}
      </main>
    </div>
  );
}

