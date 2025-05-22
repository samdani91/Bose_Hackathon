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
  createdAt: string,
  description: string,
  downvotes: number,
  images: string[],
  tags: string[],
  title: string,
  updatedAt: string,
  upvotes: number,
  user_id: string,
  viewsCount: number,
  _id: string,
}

export interface Answer {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: User;
  questionId: string;
  votes: number;
  isAccepted: boolean;
  comments: Comment[];
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
  id: string;
  name: string;
  description: string;
  count: number; // Number of questions with this tag
}