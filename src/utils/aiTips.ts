import { Transaction } from '../types';
import { analyzeHabits, HabitAnalysis } from './habitAnalysis';

interface Tip {
  message: string;
  impact?: number;
  priority: number;
  category: string;
}

export function generateTips(transactions: Transaction[]): Tip[] {
  const habits = analyzeHabits(transactions);
  const tips: Tip[] = [];

  // Generate personalized tips based on habits
  habits.habits.forEach(habit => {
    switch (habit.type) {
      case 'transport':
        tips.push({
          category: 'transport',
          priority: 1,
          message: "Your transport usage is significant. Consider:\n• Using public transit\n• Carpooling\n• Cycling for short distances",
          impact: habit.impact * 0.5
        });
        break;
      case 'food':
        tips.push({
          category: 'food',
          priority: 2,
          message: "To reduce your food carbon footprint:\n• Choose local produce\n• Reduce meat consumption\n• Plan meals to minimize waste",
          impact: habit.impact * 0.4
        });
        break;
      case 'recurring':
        tips.push({
          category: 'lifestyle',
          priority: 3,
          message: "For your regular purchases:\n• Look for eco-friendly alternatives\n• Buy in bulk to reduce packaging\n• Choose sustainable brands",
          impact: habit.impact * 0.3
        });
        break;
    }
  });

  // Add category-specific tips based on top spending
  if (habits.topCategory) {
    const categoryTips = {
      food: {
        message: "Try meal prepping and buying seasonal produce to reduce both costs and carbon footprint",
        impact: 0.2
      },
      transport: {
        message: "Consider investing in an electric vehicle or using more public transportation",
        impact: 0.4
      },
      shopping: {
        message: "Research sustainable brands and consider second-hand options for non-essential items",
        impact: 0.3
      },
      utilities: {
        message: "Invest in smart home devices to optimize energy usage and reduce utility bills",
        impact: 0.5
      },
      entertainment: {
        message: "Look for eco-friendly entertainment options like outdoor activities or local events",
        impact: 0.1
      }
    };

    if (categoryTips[habits.topCategory as keyof typeof categoryTips]) {
      tips.push({
        category: habits.topCategory,
        priority: 1,
        ...categoryTips[habits.topCategory as keyof typeof categoryTips]
      });
    }
  }

  // Add sustainability score feedback
  tips.push({
    category: 'general',
    priority: 4,
    message: `Your sustainability score is ${Math.round(habits.sustainabilityScore)}%. ${
      habits.sustainabilityScore > 70
        ? "Great job! Keep up the sustainable choices."
        : "There's room for improvement in your carbon footprint."
    }`,
    impact: 0
  });

  // Sort tips by priority
  return tips.sort((a, b) => a.priority - b.priority);
}