import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiPlus, FiSearch, FiRotateCcw, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import Card from '../components/Card';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

/**
 * Library Management Component
 * Adapted from interface/library.png
 * Manage book catalog, issues, returns, and fines
 */
const Library = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'fiction',
    copies: '',
  });

  // Mock data
  const [books, setBooks] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'fiction', totalCopies: 5, availableCopies: 2, issued: 3 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'fiction', totalCopies: 4, availableCopies: 1, issued: 3 },
    { id: 3, title: 'Python Programming', author: 'Guido van Rossum', isbn: '978-1-491-95659-8', category: 'technical', totalCopies: 3, availableCopies: 3, issued: 0 },
    { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0-062-31629-1', category: 'non-fiction', totalCopies: 6, availableCopies: 4, issued: 2 },
    { id: 5, title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'fiction', totalCopies: 5, availableCopies: 0, issued: 5 },
  ]);

  const [issues, setIssues] = useState([
    { id: 1, studentName: 'John Smith', bookTitle: 'To Kill a Mockingbird', issueDate: '2024-01-10', dueDate: '2024-01-24', fine: 0, status: 'active' },
    { id: 2, studentName: 'Jane Doe', bookTitle: 'Sapiens', issueDate: '2024-01-08', dueDate: '2024-01-22', fine: 150, status: 'overdue' },
    { id: 3, studentName: 'Bob Wilson', bookTitle: 'The Great Gatsby', issueDate: '2024-01-12', dueDate: '2024-01-26', fine: 0, status: 'active' },
    { id: 4, studentName: 'Alice Johnson', bookTitle: '1984', issueDate: '2024-01-05', dueDate: '2024-01-19', fine: 300, status: 'overdue' },
  ]);

  const handleAddBook = () => {
    if (!formData.title || !formData.author) {
      toast.error('Please fill in required fields');
      return;
    }

    const newBook = {
      id: Date.now(),
      ...formData,
      totalCopies: parseInt(formData.copies),
      availableCopies: parseInt(formData.copies),
      issued: 0,
    };

    setBooks([newBook, ...books]);
    setFormData({ title: '', author: '', isbn: '', category: 'fiction', copies: '' });
    setIsAddModalOpen(false);
    toast.success('Book added successfully!');
  };

  const handleReturnBook = (id) => {
    setIssues(issues.map(issue =>
      issue.id === id ? { ...issue, status: 'returned' } : issue
    ));
    toast.success('Book returned successfully!');
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter(b => b.id !== id));
    toast.success('Book removed from catalog');
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalFines = issues.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.fine, 0);

  const categories = ['all', 'fiction', 'non-fiction', 'technical', 'reference'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Library Management</h1>
        <p className="text-gold-100">Manage books, issues, returns, and fines</p>
      </motion.div>

      {/* Quick Stats */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Books', value: books.length, icon: FiBook },
            { label: 'Available', value: books.reduce((sum, b) => sum + b.availableCopies, 0), icon: FiBook },
            { label: 'Issued', value: books.reduce((sum, b) => sum + b.issued, 0), icon: FiBook },
            { label: 'Total Copies', value: books.reduce((sum, b) => sum + b.totalCopies, 0), icon: FiBook },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="text-center">
                  <Icon size={24} className="mx-auto mb-2 text-gold-600" />
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gold-700">{stat.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-beige-200">
        {['catalog', 'issues', 'returns'].map(tab => (
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

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search books or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gold-500 text-white px-6 py-2 rounded-lg hover:bg-gold-600 transition font-medium whitespace-nowrap"
            >
              <FiPlus size={20} />
              Add Book
            </motion.button>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.length === 0 ? (
              <Card className="text-center py-12 text-gray-500 md:col-span-2 lg:col-span-3">
                <FiBook size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No books found</p>
              </Card>
            ) : (
              filteredBooks.map((book, idx) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="hover:shadow-gold-md transition flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                          <FiBook size={24} className="text-gold-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{book.author}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ISBN:</span>
                          <span className="font-medium text-gray-900">{book.isbn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-gray-900 capitalize">{book.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Copies:</span>
                          <span className="font-medium text-gray-900">{book.totalCopies}</span>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-beige-100 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-green-700">Available: {book.availableCopies}</span>
                          <span className="text-sm font-medium text-red-700">Issued: {book.issued}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-beige-200">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                      >
                        Issue
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* Issues Tab */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          {issues.filter(i => i.status === 'active').length === 0 ? (
            <Card className="text-center py-12 text-gray-500">
              <FiBook size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No active issues</p>
            </Card>
          ) : (
            issues.filter(i => i.status === 'active').map((issue, idx) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{issue.bookTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">Issued to: {issue.studentName}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Issued</p>
                          <p className="font-medium text-gray-900">{issue.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Due</p>
                          <p className="font-medium text-gray-900">{issue.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReturnBook(issue.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Mark as returned"
                    >
                      <FiRotateCcw size={20} />
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Returns Tab - Shows overdue books with fines */}
      {activeTab === 'returns' && (
        <>
          {totalFines > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <FiAlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-900">Overdue Books Detected</p>
                <p className="text-sm text-red-700">Total fines pending: {totalFines.toLocaleString()}</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {issues.filter(i => i.status === 'overdue').map((issue, idx) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-l-4 border-red-500">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{issue.bookTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">Student: {issue.studentName}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Issued</p>
                          <p className="font-medium text-gray-900">{issue.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Due Date</p>
                          <p className="font-medium text-red-700">{issue.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fine</p>
                          <p className="font-bold text-red-700">₹ {issue.fine}</p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReturnBook(issue.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Mark as returned"
                    >
                      <FiRotateCcw size={20} />
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add Book Modal */}
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
                    Add New Book
                  </Dialog.Title>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Book Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="text"
                      placeholder="Author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="text"
                      placeholder="ISBN"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    >
                      {categories.filter(c => c !== 'all').map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Number of Copies"
                      value={formData.copies}
                      onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddBook}
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

export default Library;
