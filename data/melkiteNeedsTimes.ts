import { Church, Rite } from '../types';

// Melkite (Greek Catholic) churches in Lebanon that we want listed,
// but do NOT yet have Mass times entered on the site.
//
// Add entries here with `schedule: []` until you have verified times.
export const MELKITE_CHURCHES_NEEDS_TIMES: Church[] = [
  // Example:
  // {
  //   id: 'melkite-1',
  //   name: 'St. Example Melkite Parish',
  //   rite: Rite.MELKITE,
  //   city: 'Beirut',
  //   district: 'Example',
  //   address: 'Street, Beirut',
  //   coordinates: { lat: 33.9, lng: 35.5 },
  //   imageUrl: 'https://example.com/photo.jpg',
  //   description: 'Short description.',
  //   schedule: [],
  // },
];

