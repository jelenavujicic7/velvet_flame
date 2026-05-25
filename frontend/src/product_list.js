import elegantnaSveca from './assets/19ac7efe-f1f1-46bc-83b0-d6c1b962e436.jpeg';
import mirisnaSveca from './assets/65299604-0734-49b2-9aeb-13c24d84fb2e.jpeg';
import poklonSet from './assets/86299b86-1841-4932-a69b-3dfc8c314031.jpeg';
import dekorativnaSveca from './assets/94930ac0-ba23-47ee-9693-276b1b83d240.jpeg';
import luksuznaSveca from './assets/a4fbdfaf-0f3f-47bb-82b5-679762720414.jpeg';
import romanticnaSveca from './assets/c58afdcf-3d66-45df-9e2a-e0087f0ab818.jpeg';
import pastelnaSveca from './assets/f18547b1-9c9c-4414-bd7a-964fe6a41440.jpeg';
import premiumSet from './assets/f3c0cb99-570e-4e5a-b37a-a67efbeba968.jpeg';

const products = [
  {
    _id: '1',
    name: 'Elegantna sveca',
    image: elegantnaSveca,
    description:
      'Rucno izradjena sveca za toplu i elegantnu atmosferu u domu.',
    category: 'Svece',
    price: 450.0,
    countInStock: 10,
    rating: 5.0,
    numReviews: 12,
  },
  {
    _id: '2',
    name: 'Mirisna sveca',
    image: mirisnaSveca,
    description:
      'Nezna mirisna sveca koja prostoru daje luksuzan i prijatan osecaj.',
    category: 'Svece',
    price: 700.0,
    countInStock: 7,
    rating: 5.0,
    numReviews: 8,
  },
  {
    _id: '3',
    name: 'Poklon set',
    image: poklonSet,
    description:
      'Pazljivo uklopljen set za poklon, posebne datume i male znake paznje.',
    category: 'Pokloni',
    price: 450.0,
    countInStock: 5,
    rating: 4.6,
    numReviews: 12,
  },
  {
    _id: '4',
    name: 'Dekorativna sveca',
    image: dekorativnaSveca,
    description:
      'Dekorativna sveca koja lepo izgleda na polici, stolu ili nocnom ormaricu.',
    category: 'Dekoracija',
    price: 950.0,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  },
  {
    _id: '5',
    name: 'Lux kolekcija',
    image: luksuznaSveca,
    description:
      'Sveca iz elegantne Elena Lux kolekcije za poseban izgled enterijera.',
    category: 'Lux',
    price: 650.0,
    countInStock: 7,
    rating: 4.9,
    numReviews: 10,
  },
  {
    _id: '6',
    name: 'Uskršnja dekoracija',
    image: romanticnaSveca,
    description:
      'Uskrsnja dekoracija sa toplim detaljima za praznicni sto i dom.',
    category: 'Svece',
    price: 1200.0,
    countInStock: 0,
    rating: 4,
    numReviews: 12,
  },
  {
    _id: '7',
    name: 'Pastelna sveca',
    image: pastelnaSveca,
    description:
      'Nezna dekorativna sveca u pastelnom tonu za miran i elegantan prostor.',
    category: 'Dekoracija',
    price: 800.0,
    countInStock: 9,
    rating: 4.8,
    numReviews: 6,
  },
  {
    _id: '8',
    name: 'Premium poklon set',
    image: premiumSet,
    description:
      'Luksuzan Elena Lux set za poklon, pazljivo pripremljen za posebne prilike.',
    category: 'Pokloni',
    price: 600.0,
    countInStock: 4,
    rating: 5,
    numReviews: 9,
  },
];

export default products;
