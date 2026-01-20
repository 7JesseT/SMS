import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { FiBus, FiPlane, FiPlus, FiSearch, FiEdit2, FiTrash2, FiMapPin, FiUser, FiCalendar } from 'react-icons/fi';
import Card from '../components/Card';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

/**
 * Transport Management Component
 * Adapted from interface/transport.png
 * Manages bus and airplane transport for students
 */
const Transport = () => {
  const [transportType, setTransportType] = useState('bus');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    driver: '',
    capacity: '',
    route: '',
    time: '',
  });

  // Mock data
  const [busRoutes, setBusRoutes] = useState([
    { id: 1, name: 'Route A', vehicleNumber: 'BUS001', driver: 'John Driver', capacity: 45, passengers: 38, route: 'Downtown - School', time: '7:30 AM' },
    { id: 2, name: 'Route B', vehicleNumber: 'BUS002', driver: 'Jane Smith', capacity: 45, passengers: 42, route: 'Midtown - School', time: '8:00 AM' },
    { id: 3, name: 'Route C', vehicleNumber: 'BUS003', driver: 'Bob Wilson', capacity: 45, passengers: 35, route: 'Uptown - School', time: '8:30 AM' },
  ]);

  const [planeData, setPlaneData] = useState([
    { id: 1, name: 'Flight A', airline: 'SkyWings', flightNumber: 'SK101', route: 'City A - City B', date: '2024-02-15', students: 12 },
    { id: 2, name: 'Flight B', airline: 'AeroExpress', flightNumber: 'AE205', route: 'City B - City C', date: '2024-02-20', students: 8 },
  ]);

  const handleAddTransport = () => {
    if (!formData.name || !formData.vehicleNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    const newTransport = {
      id: Date.now(),
      ...formData,
      passengers: 0,
      students: 0,
    };

    if (transportType === 'bus') {
      setBusRoutes([...busRoutes, newTransport]);
    } else {
      setPlaneData([...planeData, newTransport]);
    }

    setFormData({ name: '', vehicleNumber: '', driver: '', capacity: '', route: '', time: '' });
    setIsAddModalOpen(false);
    toast.success(`${transportType === 'bus' ? 'Bus' : 'Flight'} added successfully!`);
  };

  const handleDelete = (id, type) => {
    if (type === 'bus') {
      setBusRoutes(busRoutes.filter(r => r.id !== id));
    } else {
      setPlaneData(planeData.filter(r => r.id !== id));
    }
    toast.success('Transport removed');
  };

  const filteredBuses = busRoutes.filter(bus =>
    bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlanes = planeData.filter(plane =>
    plane.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plane.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Transport Management</h1>
        <p className="text-gold-100">Manage buses and flights for students</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-beige-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTransportType('bus')}
          className={`flex items-center gap-2 pb-3 px-4 border-b-2 font-medium transition ${
            transportType === 'bus'
              ? 'border-gold-500 text-gold-700'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <FiBus size={20} />
          Bus Routes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTransportType('plane')}
          className={`flex items-center gap-2 pb-3 px-4 border-b-2 font-medium transition ${
            transportType === 'plane'
              ? 'border-gold-500 text-gold-700'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <FiPlane size={20} />
          Flights
        </motion.button>
      </div>

      {/* Search and Add */}
      <div className="flex gap-4 flex-col sm:flex-row items-stretch sm:items-center">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 text-white px-6 py-2 rounded-lg hover:bg-gold-600 transition font-medium"
        >
          <FiPlus size={20} />
          Add {transportType === 'bus' ? 'Bus' : 'Flight'}
        </motion.button>
      </div>

      {/* Bus Routes */}
      {transportType === 'bus' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredBuses.length === 0 ? (
            <Card className="text-center py-12 text-gray-500">
              <FiBus size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No bus routes found</p>
            </Card>
          ) : (
            filteredBuses.map((bus, idx) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="hover:shadow-gold-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center">
                          <FiBus size={24} className="text-gold-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{bus.name}</h3>
                          <p className="text-sm text-gray-600">{bus.vehicleNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="text-sm">
                          <p className="text-gray-600">Driver</p>
                          <p className="font-medium text-gray-900">{bus.driver}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Route</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <FiMapPin size={14} className="text-gold-500" />
                            {bus.route}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Capacity</p>
                          <p className="font-medium text-gray-900">{bus.passengers}/{bus.capacity}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Departure</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <FiCalendar size={14} className="text-gold-500" />
                            {bus.time}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
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
                        onClick={() => handleDelete(bus.id, 'bus')}
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
      )}

      {/* Flights */}
      {transportType === 'plane' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredPlanes.length === 0 ? (
            <Card className="text-center py-12 text-gray-500">
              <FiPlane size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No flights found</p>
            </Card>
          ) : (
            filteredPlanes.map((plane, idx) => (
              <motion.div
                key={plane.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="hover:shadow-gold-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center">
                          <FiPlane size={24} className="text-gold-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{plane.name}</h3>
                          <p className="text-sm text-gray-600">{plane.flightNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="text-sm">
                          <p className="text-gray-600">Airline</p>
                          <p className="font-medium text-gray-900">{plane.airline}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Route</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <FiMapPin size={14} className="text-gold-500" />
                            {plane.route}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <FiCalendar size={14} className="text-gold-500" />
                            {plane.date}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Students</p>
                          <p className="font-medium text-gray-900">{plane.students} enrolled</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FiEdit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(plane.id, 'plane')}
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
      )}

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
                    Add New {transportType === 'bus' ? 'Bus' : 'Flight'}
                  </Dialog.Title>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                    <input
                      type="text"
                      placeholder={transportType === 'bus' ? 'Vehicle Number' : 'Flight Number'}
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                    <input
                      type="text"
                      placeholder={transportType === 'bus' ? 'Driver Name' : 'Airline'}
                      value={formData.driver}
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                    <input
                      type="text"
                      placeholder="Route"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                    <input
                      type={transportType === 'bus' ? 'time' : 'date'}
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                    {transportType === 'bus' && (
                      <input
                        type="number"
                        placeholder="Capacity"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                      />
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddTransport}
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

export default Transport;
