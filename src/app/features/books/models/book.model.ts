export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  genre: string;
  available: boolean;
  stock: number | null;
  description: string;
}
