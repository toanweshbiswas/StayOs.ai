import { Home } from './types';

export const featuredHomes: Home[] = [
  {
    id: '1',
    name: 'Muse',
    location: 'Ulsoor',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    availableDate: 'Available Now',
    sqft: 1700,
    bhk: 2,
    availableRooms: '2/2 Available',
    price: '35,000',
    occupancyDescription: "You'll be the first occupant in this house"
  },
  {
    id: '2',
    name: 'Classical Indian Condo',
    location: 'Bellandur',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    availableDate: 'Available Now',
    isFemaleOnly: true,
    sqft: 2200,
    bhk: 3,
    availableRooms: '1/3 Available',
    price: '33,000',
    flatmates: ['zepto']
  },
  {
    id: '3',
    name: 'Raintree',
    location: 'Hebbal',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    availableDate: 'Available Now',
    sqft: 2500,
    bhk: 3,
    availableRooms: '1/3 Available',
    price: '30,000',
    occupancyDescription: "Flatmates from",
    flatmates: ['generic']
  },
  {
    id: '4',
    name: 'Halo',
    location: 'Indiranagar',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=800',
    availableDate: 'Available Now',
    sqft: 2100,
    bhk: 3,
    availableRooms: 'Fully Booked',
    price: '42,000'
  }
];