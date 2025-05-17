export interface Update {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
}

export interface UpdateFormData {
  content: string;
}

export interface UpdateStats {
  total: number;
  byDay: Record<string, number>;
  frequentWords: Array<{ word: string; count: number }>;
} 