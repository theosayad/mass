import { useEffect, useMemo, useState } from 'react';
import { Church } from '../types';
import { LEBANON_CHURCHES } from '../data/mockData';

type ChurchOverride = Partial<Omit<Church, 'id'>>;
type OverridesState = Record<string, ChurchOverride>;

const OVERRIDES_KEY = 'mtl_church_overrides_v1';
const CHURCH_EVENT = 'mtl-church';

const dispatchChurchEvent = () => window.dispatchEvent(new Event(CHURCH_EVENT));

export const onChurchDataChange = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === OVERRIDES_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CHURCH_EVENT, callback);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CHURCH_EVENT, callback);
  };
};

export const loadOverrides = (): OverridesState => {
  const raw = localStorage.getItem(OVERRIDES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as OverridesState;
  } catch {
    return {};
  }
};

export const saveOverride = (churchId: string, override: ChurchOverride) => {
  const current = loadOverrides();
  const next: OverridesState = { ...current, [churchId]: override };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
  dispatchChurchEvent();
};

export const clearOverride = (churchId: string) => {
  const current = loadOverrides();
  if (!current[churchId]) return;
  const { [churchId]: _, ...rest } = current;
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(rest));
  dispatchChurchEvent();
};

export const mergeChurch = (base: Church, override: ChurchOverride | undefined): Church => {
  if (!override) return base;
  return { ...base, ...override, id: base.id, coordinates: { ...base.coordinates, ...(override.coordinates ?? {}) } };
};

export const getChurches = (): Church[] => {
  const overrides = loadOverrides();
  return LEBANON_CHURCHES.map((c) => mergeChurch(c, overrides[c.id]));
};

export const getChurchById = (churchId: string): Church | null => {
  const base = LEBANON_CHURCHES.find((c) => c.id === churchId);
  if (!base) return null;
  const overrides = loadOverrides();
  return mergeChurch(base, overrides[churchId]);
};

export const useChurches = () => {
  const [version, setVersion] = useState(0);
  useEffect(() => onChurchDataChange(() => setVersion((v) => v + 1)), []);
  return useMemo(() => getChurches(), [version]);
};

export const useChurch = (churchId: string | null) => {
  const [version, setVersion] = useState(0);
  useEffect(() => onChurchDataChange(() => setVersion((v) => v + 1)), []);
  return useMemo(() => (churchId ? getChurchById(churchId) : null), [churchId, version]);
};

