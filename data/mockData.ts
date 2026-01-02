
import { Church, Rite } from '../types';

export const LEBANON_CHURCHES: Church[] = [
  {
    id: '1',
    name: 'St. George Maronite Cathedral',
    rite: Rite.MARONITE,
    city: 'Beirut',
    district: 'Downtown',
    address: 'Place de l\'Étoile, Beirut',
    coordinates: { lat: 33.8964, lng: 35.5049 },
    imageUrl: 'https://picsum.photos/seed/stgeorge/800/600',
    description: 'The primary cathedral of the Maronite Archdiocese of Beirut.',
    schedule: [
      { day: 'Sunday', time: '08:00', language: 'Arabic' },
      { day: 'Sunday', time: '10:00', language: 'Arabic' },
      { day: 'Sunday', time: '12:00', language: 'French' },
      { day: 'Saturday', time: '18:00', language: 'Arabic' }
    ]
  },
  {
    id: '2',
    name: 'Our Lady of Lebanon (Harissa)',
    rite: Rite.MARONITE,
    city: 'Harissa',
    district: 'Keserwan',
    address: 'Harissa Hill, Jounieh',
    coordinates: { lat: 33.9814, lng: 35.6514 },
    imageUrl: 'https://picsum.photos/seed/harissa/800/600',
    description: 'One of the most important shrines in the world honoring the Virgin Mary.',
    schedule: [
      { day: 'Sunday', time: '07:30', language: 'Arabic' },
      { day: 'Sunday', time: '09:00', language: 'Arabic' },
      { day: 'Sunday', time: '10:30', language: 'Arabic' },
      { day: 'Sunday', time: '12:00', language: 'French' },
      { day: 'Sunday', time: '18:00', language: 'Arabic' }
    ]
  },
  {
    id: '3',
    name: 'St. Louis Cathedral',
    rite: Rite.LATIN,
    city: 'Beirut',
    district: 'Bab Idriss',
    address: 'Weygand Street, Beirut',
    coordinates: { lat: 33.8972, lng: 35.5011 },
    imageUrl: 'https://picsum.photos/seed/stlouis/800/600',
    description: 'A historic Capuchin cathedral in the heart of Beirut.',
    schedule: [
      { day: 'Sunday', time: '09:00', language: 'French' },
      { day: 'Sunday', time: '11:00', language: 'French' },
      { day: 'Sunday', time: '18:30', language: 'English' }
    ]
  },
  {
    id: '4',
    name: 'St. John Baptist Church',
    rite: Rite.MARONITE,
    city: 'Byblos',
    district: 'Jbeil',
    address: 'Old Souk, Byblos',
    coordinates: { lat: 34.1204, lng: 35.6459 },
    imageUrl: 'https://picsum.photos/seed/byblos/800/600',
    description: 'A crusader-era church located in the historic city of Byblos.',
    schedule: [
      { day: 'Sunday', time: '08:30', language: 'Arabic' },
      { day: 'Sunday', time: '11:00', language: 'Arabic' }
    ]
  },
  {
    id: '5',
    name: 'St. Maron Church',
    rite: Rite.MARONITE,
    city: 'Tripoli',
    district: 'Tripoli',
    address: 'Gemmayzeh Street, Tripoli',
    coordinates: { lat: 34.4367, lng: 35.8497 },
    imageUrl: 'https://picsum.photos/seed/tripoli/800/600',
    description: 'A central Maronite church in the northern capital.',
    schedule: [
      { day: 'Sunday', time: '09:00', language: 'Arabic' },
      { day: 'Sunday', time: '11:00', language: 'Arabic' }
    ]
  },
  {
    id: '6',
    name: 'Our Lady of Deliverance',
    rite: Rite.MELKITE,
    city: 'Zahle',
    district: 'Zahle',
    address: 'Main Road, Zahle',
    coordinates: { lat: 33.8463, lng: 35.9020 },
    imageUrl: 'https://picsum.photos/seed/zahle/800/600',
    description: 'Seat of the Melkite Greek Catholic Archbishop of Zahle and Furzol.',
    schedule: [
      { day: 'Sunday', time: '08:00', language: 'Arabic' },
      { day: 'Sunday', time: '10:30', language: 'Arabic' }
    ]
  }
];
