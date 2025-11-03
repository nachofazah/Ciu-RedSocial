export interface Post {
  id: number;
  userId: number;
  description: string;
  images?: string[];
  tags?: string[];
  commentsCount?: number;
}