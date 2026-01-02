
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
    imageUrl: 'https://images.unsplash.com/photo-1626078299034-9694ec627685?q=80&w=1000&auto=format&fit=crop',
    description: 'The primary cathedral of the Maronite Archdiocese of Beirut. It is a landmark of the city\'s historic center, known for its stunning architecture and its proximity to the Mohammad Al-Amin Mosque, symbolizing Lebanese coexistence.',
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
    imageUrl: 'https://images.unsplash.com/photo-1596434407886-f366113876e0?q=80&w=1000&auto=format&fit=crop',
    description: 'One of the most important shrines in the world honoring the Virgin Mary. The site features a massive bronze statue of Mary overlooking the Bay of Jounieh and a modern cathedral with unique architecture.',
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
    imageUrl: 'https://images.unsplash.com/photo-1548625316-563f46f48f43?q=80&w=1000&auto=format&fit=crop',
    description: 'A historic Capuchin cathedral in the heart of Beirut. Built in the late 19th century, it is known for its red-brick facade and beautiful interior paintings.',
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
    imageUrl: 'https://images.unsplash.com/photo-1621340182607-4286f9f91a9b?q=80&w=1000&auto=format&fit=crop',
    description: 'A beautiful Crusader-era church built in 1115 AD. Located within the historic old city of Byblos, it is famous for its open-air baptistery and medieval stone architecture.',
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
    imageUrl: 'https://images.unsplash.com/photo-1518116520330-80d0d80e8c8a?q=80&w=1000&auto=format&fit=crop',
    description: 'A central Maronite church in Tripoli, representing the Christian presence in the northern capital. It is a hub for the local community and hosting major religious events.',
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
    imageUrl: 'https://images.unsplash.com/photo-1565553018290-951978255dfd?q=80&w=1000&auto=format&fit=crop',
    description: 'The seat of the Melkite Greek Catholic Archbishop of Zahle and Furzol. Zahle is known as the "City of Churches," and this cathedral is its spiritual heart.',
    schedule: [
      { day: 'Sunday', time: '08:00', language: 'Arabic' },
      { day: 'Sunday', time: '10:30', language: 'Arabic' }
    ]
  }
];
