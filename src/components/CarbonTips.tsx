import React from 'react';
import { Lightbulb, TrendingDown, Award } from 'lucide-react';
import { Transaction } from '../types';
import { generateTips } from '../utils/aiTips';
import { analyzeHabits } from '../utils/habitAnalysis';

interface Props {
  transactions: Transaction[];
}

function CarbonTips({ transactions }: Props) {
  const tips = generateTips(transactions);
  const habits = analyzeHabits(transactions);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Smart Tips</h2>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">
            Score: {Math.round(habits.sustainabilityScore)}
          </span>
        </div>
      </div>

      {habits.habits.length > 0 && (
        <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <h3 className="font-medium text-emerald-900">Habit Analysis</h3>
          </div>
          <p className="text-sm text-emerald-800">
            Your top spending category is <strong>{habits.topCategory}</strong>.
            Total environmental impact: {habits.totalImpact.toFixed(2)} kg CO₂
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50/50 to-transparent rounded-lg"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-yellow-700">#{index + 1}</span>
            </div>
            <div>
              <p className="text-gray-700 whitespace-pre-line">{tip.message}</p>
              {tip.impact && tip.impact > 0 && (
                <p className="text-sm text-emerald-600 mt-1">
                  Potential impact: {tip.impact.toFixed(2)} kg CO₂ reduction
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarbonTips;