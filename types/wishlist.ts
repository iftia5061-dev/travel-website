export interface WishlistItem {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'tour' | 'hotel' | 'hajj' | 'umrah';
  itemName: string;
  itemImage: string;
  price: number;
  createdAt: Date;
}
