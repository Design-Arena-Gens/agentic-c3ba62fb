export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  itemsCount: number;
  tradesCount: number;
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: Category;
  images: string[];
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userPhoto?: string;
}

export type Category =
  | 'Electronics'
  | 'Clothing'
  | 'Books'
  | 'Home & Garden'
  | 'Sports'
  | 'Toys'
  | 'Other';

export interface Trade {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromItemId: string;
  toItemId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  fromUserName: string;
  toUserName: string;
  fromItemTitle: string;
  toItemTitle: string;
  fromItemImage?: string;
  toItemImage?: string;
}
