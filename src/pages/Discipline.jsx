import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FiAlertCircle, FiPlus, FiCheckCircle, FiAward, FiFilter, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Card from '../components/Card';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

/**
 * Discipline & Behavior Tracking Component
 * Adapted from interface/discipline.png
 * Track student conduct, incidents, and interventions
 */
const Discipline = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    incidentType: 'minor',
    description: '',
    date: '',
    action: '',
  });

  // Mock data
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      studentName: 'John Smith',
      incidentType: 'minor',
      date: '2024-01-15',
      description: 'Late submission of assignment',
      action: 'Verbal Warning',
      resolved: false,
    },
    {
      id: 2,
      studentName: 'Jane Doe',
      incidentType: 'major',
      date: '2024-01-14',
      description: 'Inappropriate behavior in class',
      action: 'Parent Conference Scheduled',
      resolved: false,
    },
    {
      id: 3,
      studentName: 'Bob Wilson',
      incidentType: 'minor',
      date: '2024-01-10',
      description: 'Incomplete homework',
      action: 'Follow-up conversation',
      resolved: true,
    },
    {
      id: 4,
      studentName: 'Alice Johnson',
      incidentType: 'positive',
      date: '2024-01-12',
      description: 'Excellent academic performance',
      action: 'Certificate of Achievement',
      resolved: true,
    },
  ]);

  const handleAddIncident = () => {
    if (!formData.studentName || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const newIncident = {
      id: Date.now(),
      ...formData,
      resolved: false,
    };

    setIncidents([newIncident, ...incidents]);
    setFormData({ studentName: '', incidentType: 'minor', description: '', date: '', action: '' });
    setIsAddModalOpen(false);
    toast.success('Incident recorded successfully!');
  };

  const handleDelete = (id) => {
    setIncidents(incidents.filter(i => i.id !== id));
    toast.success('Incident removed');
  };

  const handleResolve = (id) => {
    setIncidents(incidents.map(i => i.id === id ? { ...i, resolved: true } : i));
    toast.success('Incident marked as resolved');
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesType = filterType === 'all' || incident.incidentType === filterType;
    const matchesSearch = incident.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const incidentStats = {
    total: incidents.length,
    minor: incidents.filter(i => i.incidentType === 'minor').length,
    major: incidents.filter(i => i.incidentType === 'major').length,
    positive: incidents.filter(i => i.incidentType === 'positive').length,
  };

  const getIncidentColor = (type) => {
    switch (type) {
      case 'major':
        return 'text-red-600';
      case 'minor':
        return 'text-yellow-600';
      case 'positive':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getIncidentBgColor = (type) => {
    switch (type) {
      case 'major':
        return 'bg-red-50 border-red-200';
      case 'minor':
        return 'bg-yellow-50 border-yellow-200';
      case 'positive':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Discipline & Behavior</h1>
        <p className="text-gold-100">Track student conduct and interventions</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: incidentStats.total, icon: FiAlertCircle, color: 'text-gray-600' },
          { label: 'Minor', value: incidentStats.minor, icon: FiAlertCircle, color: 'text-yellow-600' },
          { label: 'Major', value: incidentStats.major, icon: FiAlertCircle, color: 'text-red-600' },
          { label: 'Positive', value: incidentStats.positive, icon: FiAward, color: 'text-green-600' },
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
                <Icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gold-700">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {['all', 'minor', 'major', 'positive'].map(type => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                filterType === type
                  ? 'bg-gold-500 text-white'
                  : 'bg-beige-200 text-gray-700 hover:bg-beige-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search student or incident..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 text-white px-6 py-2 rounded-lg hover:bg-gold-600 transition font-medium whitespace-nowrap"
        >
          <FiPlus size={20} />
          Record Incident
        </motion.button>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <Card className="text-center py-12 text-gray-500">
            <FiAlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No incidents found</p>
          </Card>
        ) : (
          filteredIncidents.map((incident, idx) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`border-l-4 hover:shadow-gold-md transition ${getIncidentBgColor(incident.incidentType)}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border-2 ${getIncidentColor(incident.incidentType).replace('text-', 'border-')}`}>
                        {incident.incidentType === 'positive' ? (
                          <FiAward size={24} className={getIncidentColor(incident.incidentType)} />
                        ) : (
                          <FiAlertCircle size={24} className={getIncidentColor(incident.incidentType)} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{incident.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          {incident.incidentType.charAt(0).toUpperCase() + incident.incidentType.slice(1)} • {incident.date}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{incident.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                        {incident.action}
                      </span>
                      {incident.resolved && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm font-medium text-green-700">
                          <FiCheckCircle size={14} />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!incident.resolved && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleResolve(incident.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Mark as resolved"
                      >
                        <FiCheckCircle size={18} />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(incident.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
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

      {/* Add Modal */}
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
                    Record New Incident
                  </Dialog.Title>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Student Name"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <select
                      value={formData.incidentType}
                      onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    >
                      <option value="minor">Minor</option>
                      <option value="major">Major</option>
                      <option value="positive">Positive</option>
                    </select>

                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30 h-24"
                    />

                    <input
                      type="text"
                      placeholder="Action Taken"
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddIncident}
                      className="flex-1 bg-gold-500 text-white py-2 rounded-lg hover:bg-gold-600 transition font-medium"
                    >
                      Record
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

export default Discipline;
