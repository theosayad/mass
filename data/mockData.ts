
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
    imageUrl: 'https://www.4barchitects.com/img/fe_gallery/IMG_3097.JPG',
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
    imageUrl: 'https://burjonbay.com/wp-content/uploads/2016/11/1949828.jpg',
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
    imageUrl: 'https://guide.moovtoo.com/storage/galleries/Venue/the-capuchin-st-louis-church/St.%20Louis%20Church/the-capuchin-st-louis-church-2019-08-22-5d5ec871c925d.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/St._Joseph_Maronite_Cathedral_%28originally_a_crusader_cathedral%29_-_panoramio.jpg/1024px-St._Joseph_Maronite_Cathedral_%28originally_a_crusader_cathedral%29_-_panoramio.jpg',
    description: 'A crusader-era church located in the historic city of Byblos.',
    schedule: [
      { day: 'Sunday', time: '08:30', language: 'Arabic' },
      { day: 'Sunday', time: '11:00', language: 'Arabic' }
    ]
  },
  {
    id: '5',
    name: 'Our Lady of Deliverance',
    rite: Rite.MELKITE,
    city: 'Zahle',
    district: 'Zahle',
    address: 'Main Road, Zahle',
    coordinates: { lat: 33.8463, lng: 35.9020 },
    imageUrl: 'https://scontent.fbey14-1.fna.fbcdn.net/v/t1.6435-9/135844155_3826620800737516_5577889151394066264_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=pGJ_PRF25pIQ7kNvwGjq7ul&_nc_oc=Adn4IcM6gpCDV2-jUgn51aQVyGO7cBwXb8_zPcmWuAWkTGfqGq5EmLKtLGj_W2t_U7A&_nc_zt=23&_nc_ht=scontent.fbey14-1.fna&_nc_gid=uQ3bHfvXHCHjSMQJpk5tjg&oh=00_Afp9qgE11qdKexxwc8wGuLuBwTF7VhE7JBASPu7TYmoPrg&oe=697F04A4',
    description: 'Seat of the Melkite Greek Catholic Archbishop of Zahle and Furzol.',
    schedule: [
      { day: 'Sunday', time: '08:00', language: 'Arabic' },
      { day: 'Sunday', time: '10:30', language: 'Arabic' }
    ]
  }
];
