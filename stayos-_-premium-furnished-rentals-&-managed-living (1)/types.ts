export interface Home {
  id: string;
  name: string;
  location: string;
  image: string;
  availableDate: string;
  sqft: number;
  bhk: number;
  availableRooms: string;
  isFemaleOnly?: boolean;
  price?: string;
  status?: 'available' | 'coming_soon';
  occupancyDescription?: string;
  flatmates?: string[];
  description?: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  content: string;
  avatar: string;
  image?: string;
  date: string;
  likes: number;
}