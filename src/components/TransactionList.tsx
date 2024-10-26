import React from 'react';
import { Transaction } from '../types';
import { formatDate } from '../utils';
import { ShoppingBag, Car, Utensils, Home, Music } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  shopping: <ShoppingBag className="w-5 h-5" />,
  transport: <Car className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  utilities: <Home className="w-5 h-5" />,
  entertainment: <Music className="w-5 h-5" />,
};

function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {categoryIcons[transaction.category]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-emerald-600">
                  {(transaction.amount * 0.2).toFixed(2)} kg CO₂
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;