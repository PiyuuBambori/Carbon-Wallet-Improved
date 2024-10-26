import React from 'react';
import { DollarSign, Sprout } from 'lucide-react';

interface Props {
  totalSpent: number;
  totalCarbon: number;
}

function CarbonMetrics({ totalSpent, totalCarbon }: Props) {
  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <Sprout className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Carbon Footprint</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalCarbon.toFixed(2)} kg CO₂
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarbonMetrics;