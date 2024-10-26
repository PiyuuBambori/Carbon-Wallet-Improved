import { Transaction } from '../types';

export interface Habit {
  type: string;
  frequency: number;
  impact: number;
  description: string;
}

export interface HabitAnalysis {
  habits: Habit[];
  totalImpact: number;
  topCategory: string;
  sustainabilityScore: number;
}

function calculateFrequency(transactions: Transaction[], category: string): number {
  const categoryTransactions = transactions.filter(t => t.category === category);
  return categoryTransactions.length / transactions.length;
}

function calculateAverageAmount(transactions: Transaction[], category: string): number {
  const categoryTransactions = transactions.filter(t => t.category === category);
  if (categoryTransactions.length === 0) return 0;
  return categoryTransactions.reduce((sum, t) => sum + t.amount, 0) / categoryTransactions.length;
}

function identifyRecurringTransactions(transactions: Transaction[]): Transaction[] {
  const descriptions = transactions.map(t => t.description.toLowerCase());
  return transactions.filter(t => 
    descriptions.filter(d => d === t.description.toLowerCase()).length > 1
  );
}

export function analyzeHabits(transactions: Transaction[]): HabitAnalysis {
  const habits: Habit[] = [];
  let totalImpact = 0;

  // Analyze spending patterns by category
  const categories = ['food', 'transport', 'shopping', 'utilities', 'entertainment'];
  const categoryAmounts = categories.map(category => ({
    category,
    total: transactions.filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  }));

  const topCategory = categoryAmounts.sort((a, b) => b.total - a.total)[0]?.category || '';

  // Identify transport habits
  const transportFreq = calculateFrequency(transactions, 'transport');
  if (transportFreq > 0.2) {
    habits.push({
      type: 'transport',
      frequency: transportFreq,
      impact: transportFreq * 0.4,
      description: 'Frequent use of transportation'
    });
  }

  // Analyze food habits
  const foodAvg = calculateAverageAmount(transactions, 'food');
  if (foodAvg > 30) {
    habits.push({
      type: 'food',
      frequency: calculateFrequency(transactions, 'food'),
      impact: foodAvg * 0.2,
      description: 'High food spending pattern'
    });
  }

  // Identify shopping patterns
  const recurringTransactions = identifyRecurringTransactions(transactions);
  if (recurringTransactions.length > 0) {
    habits.push({
      type: 'recurring',
      frequency: recurringTransactions.length / transactions.length,
      impact: 0.3,
      description: 'Regular recurring purchases'
    });
  }

  // Calculate total impact
  totalImpact = habits.reduce((sum, habit) => sum + habit.impact, 0);

  // Calculate sustainability score (0-100)
  const sustainabilityScore = Math.max(0, Math.min(100, 100 - (totalImpact * 10)));

  return {
    habits,
    totalImpact,
    topCategory,
    sustainabilityScore
  };
}