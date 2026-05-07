export type Category =
  | "Phones"
  | "Furniture"
  | "Notes"
  | "Electronics"
  | "Fashion"
  | "Hostel items"
  | "Bikes"
  | "Books"
  | "Accessories"
  | "Miscellaneous";

export type ListingCondition = "new" | "like_new" | "good" | "fair" | "used";

export type AppUser = {
  id: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  verified: boolean;
  campus: string;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: ListingCondition;
  price: number;
  negotiable: boolean;
  location: string;
  images: string[];
  createdAt: string;
  seller: AppUser;
  featured?: boolean;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  seen: boolean;
  isOffer?: boolean;
};
