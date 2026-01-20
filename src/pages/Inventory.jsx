import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { FiAlertCircle } from 'react-icons/fi';

/**
 * Inventory Page - School inventory management
 */
const Inventory = () => {
  const { inventory } = useSelector((state) => state.data);

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minThreshold);

  const categories = [...new Set(inventory.map((item) => item.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        <p className="text-gray-600 mt-2">School resources and supplies management</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Items', value: inventory.length, color: 'gold' },
          { label: 'Categories', value: categories.length, color: 'blue' },
          { label: 'Low Stock', value: lowStockItems.length, color: 'red' },
        ].map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>
            <Card className="text-center">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-700`}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-l-4 border-red-500 bg-red-50">
          <div className="flex gap-3 items-start">
            <FiAlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Low Stock Items</h3>
              <div className="space-y-2">
                {lowStockItems.slice(0, 5).map((item) => (
                  <p key={item.id} className="text-sm text-red-700">
                    {item.name}: {item.quantity} / {item.minThreshold}
                  </p>
                ))}
                {lowStockItems.length > 5 && (
                  <p className="text-sm text-red-600 font-medium">
                    ...and {lowStockItems.length - 5} more
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Inventory by Category */}
      {categories.map((category, idx) => {
        const categoryItems = inventory.filter((item) => item.category === category);
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card title={category}>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-beige-100 rounded-lg border border-beige-200"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        item.quantity <= item.minThreshold ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.quantity}
                      </p>
                      <p className="text-xs text-gray-600">min: {item.minThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Inventory;
