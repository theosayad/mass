
export enum Rite {
  MARONITE = 'Maronite',
  MELKITE = 'Melkite (Greek Catholic)',
  GREEK_ORTHODOX = 'Greek Orthodox',
  LATIN = 'Latin (Roman Catholic)',
  ARMENIAN_CATHOLIC = 'Armenian Catholic',
  SYRIAC_CATHOLIC = 'Syriac Catholic'
}

export interface MassTime {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  language: 'Arabic' | 'French' | 'English' | 'Latin' | 'Syriac';
  note?: string;
}

export interface Church {
  id: string;
  name: string;
  rite: Rite;
  city: string;
  district: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  schedule: MassTime[];
  imageUrl: string;
  description: string;
}

export interface SearchFilters {
  query: string;
  city: string;
  rite: Rite | 'All';
  day: string;
}
