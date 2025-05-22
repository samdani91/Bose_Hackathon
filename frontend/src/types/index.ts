export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  type: 'gold' | 'silver' | 'bronze';
  description: string;
}

export interface Question {
  _id: string;
  user_id: string;
  title: string;
  description?: string;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  viewsCount: number;
}

export interface Answer {
  userId: string;
  upvoteCount: number;
  text: string;
  references: string[];
  questionId: string;
  createdAt: string;
  downvoteCount: number;
  id: string;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  author: User;
  parentId: string; // ID of the question or answer this comment belongs to
  parentType: 'question' | 'answer';
  votes: number;
}

export interface Tag {
  _id: string; 
  name: string;
  count: number;
}