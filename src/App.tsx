import React, { useEffect, useState } from 'react';
import { Wallet, Plus, LogOut } from 'lucide-react';
import TransactionForm from './components/TransactionForm';
import CarbonMetrics from './components/CarbonMetrics';
import TransactionList from './components/TransactionList';
import CarbonTips from './components/CarbonTips';
import LoginPage from './components/LoginPage';
import { Transaction } from './types';
import { useAuth } from './context/AuthContext';
import * as api from './api';

function App() {
  const { isAuthenticated, user, logout, token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadTransactions();
    }
  }, [isAuthenticated, token]);

  const loadTransactions = async () => {
    try {
      if (!token) return;
      const data = await api.getTransactions(token);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      if (!token) return;
      await api.addTransaction(token, transaction);
      await loadTransactions();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCarbon = transactions.reduce((sum, t) => sum + (t.carbonImpact || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Carbon Wallet</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CarbonMetrics totalSpent={totalSpent} totalCarbon={totalCarbon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} />
          </div>
          <div className="lg:col-span-1">
            <CarbonTips transactions={transactions} />
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TransactionForm onSubmit={addTransaction} onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;