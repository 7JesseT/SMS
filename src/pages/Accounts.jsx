import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiPlus, FiTrendingUp, FiTrendingDown, FiFilter, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Card from '../components/Card';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/**
 * Accounts & Financial Management Component
 * Adapted from interface/accounts.png
 * Manage incomes, expenses, and financial records
 */
const Accounts = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('income');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'tuition',
    date: '',
    reference: '',
  });

  // Mock financial data
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', description: 'Tuition Fees - John Smith', amount: 50000, category: 'tuition', date: '2024-01-15', reference: 'ST-001' },
    { id: 2, type: 'expense', description: 'Staff Salary - January', amount: 150000, category: 'salary', date: '2024-01-10', reference: 'EXP-001' },
    { id: 3, type: 'income', description: 'Activity Fees - 10A Class', amount: 25000, category: 'activities', date: '2024-01-12', reference: 'ST-002' },
    { id: 4, type: 'expense', description: 'Building Maintenance', amount: 35000, category: 'maintenance', date: '2024-01-08', reference: 'EXP-002' },
    { id: 5, type: 'income', description: 'Tuition Fees - Jane Doe', amount: 50000, category: 'tuition', date: '2024-01-14', reference: 'ST-003' },
    { id: 6, type: 'expense', description: 'Supplies and Equipment', amount: 45000, category: 'supplies', date: '2024-01-05', reference: 'EXP-003' },
  ]);

  const [budgetData, setBudgetData] = useState([
    { category: 'Salaries', budget: 500000, spent: 450000 },
    { category: 'Maintenance', budget: 100000, spent: 75000 },
    { category: 'Supplies', budget: 80000, spent: 65000 },
    { category: 'Utilities', budget: 50000, spent: 40000 },
  ]);

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const chartData = [
    { month: 'Jan', income: 125000, expense: 230000 },
    { month: 'Feb', income: 95000, expense: 200000 },
    { month: 'Mar', income: 140000, expense: 215000 },
    { month: 'Apr', income: 120000, expense: 210000 },
  ];

  const categoryData = [
    { name: 'Tuition', value: 100000, fill: '#D4AF37' },
    { name: 'Activities', value: 25000, fill: '#CDA434' },
    { name: 'Donations', value: 15000, fill: '#A67C00' },
    { name: 'Other', value: 10000, fill: '#8A5C1A' },
  ];

  const handleAddTransaction = () => {
    if (!formData.description || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type: transactionType,
      ...formData,
      amount: parseFloat(formData.amount),
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ description: '', amount: '', category: 'tuition', date: '', reference: '' });
    setIsAddModalOpen(false);
    toast.success('Transaction recorded successfully!');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success('Transaction removed');
  };

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Accounts & Finance</h1>
        <p className="text-gold-100">Manage school finances and transactions</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Income</p>
                <p className="text-3xl font-bold text-green-700">
                  {(totalIncome / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FiTrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Expense</p>
                <p className="text-3xl font-bold text-red-700">
                  {(totalExpense / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <FiTrendingDown size={24} className="text-red-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`border-l-4 ${netBalance >= 0 ? 'border-gold-500' : 'border-red-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Net Balance</p>
                <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-gold-700' : 'text-red-700'}`}>
                  {(netBalance / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center">
                <FiDollarSign size={24} className="text-gold-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-beige-200">
        {['overview', 'transactions', 'budget'].map(tab => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 border-b-2 font-medium transition ${
              activeTab === tab
                ? 'border-gold-500 text-gold-700'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Income vs Expense Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Income Source Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${(value / 1000).toFixed(0)}K`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTransactionType('income');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium whitespace-nowrap"
            >
              <FiPlus size={20} />
              Add Income
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTransactionType('expense');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-medium whitespace-nowrap"
            >
              <FiPlus size={20} />
              Add Expense
            </motion.button>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <Card className="text-center py-12 text-gray-500">
                <FiDollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No transactions found</p>
              </Card>
            ) : (
              filteredTransactions.map((trans, idx) => (
                <motion.div
                  key={trans.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <Card>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          trans.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {trans.type === 'income' ? (
                            <FiTrendingUp size={24} className="text-green-600" />
                          ) : (
                            <FiTrendingDown size={24} className="text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{trans.description}</h4>
                          <p className="text-sm text-gray-600">{trans.date} • {trans.reference}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <p className={`text-lg font-bold ${trans.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {trans.type === 'income' ? '+' : '-'}{(trans.amount / 1000).toFixed(1)}K
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(trans.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          {budgetData.map((item, idx) => {
            const percentage = (item.spent / item.budget) * 100;
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.category}</h4>
                      <span className="text-sm text-gray-600">
                        {(item.spent / 1000).toFixed(0)}K / {(item.budget / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-beige-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-3 rounded-full transition-all ${
                          percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-gold-500'
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Remaining: {((item.budget - item.spent) / 1000).toFixed(0)}K ({(100 - percentage).toFixed(0)}%)
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Transaction Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Add {transactionType === 'income' ? 'Income' : 'Expense'}
                  </Dialog.Title>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="text"
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="text"
                      placeholder="Reference Number"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddTransaction}
                      className="flex-1 bg-gold-500 text-white py-2 rounded-lg hover:bg-gold-600 transition font-medium"
                    >
                      Add
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 border border-beige-200 text-gray-700 py-2 rounded-lg hover:bg-beige-50 transition"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Accounts;
