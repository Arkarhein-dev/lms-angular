export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  genre: string;
  available: boolean;
  stock: number;
  description: string;
}

export type BookCreateOrUpdateRequest = Omit<Book, 'id' | 'available'>;
