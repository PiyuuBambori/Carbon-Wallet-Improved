export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  carbonImpact?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface CarbonScore {
  id: string;
  score: number;
  totalImpact: number;
  userId: string;
}

export interface Habit {
  id: string;
  type: string;
  frequency: number;
  impact: number;
  description: string;
}