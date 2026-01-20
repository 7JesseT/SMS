import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import Card from '../components/Card';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

/**
 * Health & Medical Records Component
 * Adapted from interface/health.png
 * Manage student health records, vaccinations, medical history
 */
const Health = () => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filterBloodType, setFilterBloodType] = useState('all');

  const [formData, setFormData] = useState({
    studentName: '',
    bloodType: 'O+',
    allergies: '',
    medications: '',
    emergencyContact: '',
    phone: '',
  });

  // Mock data
  const [healthProfiles, setHealthProfiles] = useState([
    {
      id: 1,
      studentName: 'John Smith',
      grade: '10A',
      bloodType: 'O+',
      height: '170cm',
      weight: '65kg',
      allergies: 'Peanuts',
      medications: 'None',
      emergencyContact: 'Mary Smith',
      phone: '555-0101',
      lastCheckup: '2024-01-10',
      vaccinations: ['COVID-19', 'Polio', 'MMR'],
    },
    {
      id: 2,
      studentName: 'Jane Doe',
      grade: '10B',
      bloodType: 'A+',
      height: '165cm',
      weight: '60kg',
      allergies: 'Shellfish',
      medications: 'Allergy Medication',
      emergencyContact: 'John Doe',
      phone: '555-0102',
      lastCheckup: '2024-01-08',
      vaccinations: ['COVID-19', 'Polio', 'MMR', 'Hepatitis B'],
    },
    {
      id: 3,
      studentName: 'Bob Wilson',
      grade: '9A',
      bloodType: 'B+',
      height: '172cm',
      weight: '68kg',
      allergies: 'None',
      medications: 'None',
      emergencyContact: 'Carol Wilson',
      phone: '555-0103',
      lastCheckup: '2023-12-20',
      vaccinations: ['COVID-19', 'Polio', 'MMR'],
    },
  ]);

  const [medicalHistory, setMedicalHistory] = useState([
    { id: 1, studentName: 'John Smith', date: '2024-01-15', condition: 'Common Cold', treatment: 'Rest and hydration', doctor: 'Dr. Smith' },
    { id: 2, studentName: 'Jane Doe', date: '2024-01-10', condition: 'Migraine', treatment: 'Medication prescribed', doctor: 'Dr. Johnson' },
    { id: 3, studentName: 'Bob Wilson', date: '2024-01-05', condition: 'Flu', treatment: 'Antiviral medication', doctor: 'Dr. Brown' },
  ]);

  const handleAddProfile = () => {
    if (!formData.studentName) {
      toast.error('Please fill in required fields');
      return;
    }

    const newProfile = {
      id: Date.now(),
      ...formData,
      grade: '10A',
      height: '170cm',
      weight: '65kg',
      lastCheckup: new Date().toISOString().split('T')[0],
      vaccinations: [],
    };

    setHealthProfiles([newProfile, ...healthProfiles]);
    setFormData({ studentName: '', bloodType: 'O+', allergies: '', medications: '', emergencyContact: '', phone: '' });
    setIsAddModalOpen(false);
    toast.success('Health profile created successfully!');
  };

  const handleDelete = (id) => {
    setHealthProfiles(healthProfiles.filter(p => p.id !== id));
    toast.success('Profile removed');
  };

  const filteredProfiles = healthProfiles.filter(profile => {
    const matchesSearch = profile.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlood = filterBloodType === 'all' || profile.bloodType === filterBloodType;
    return matchesSearch && matchesBlood;
  });

  const bloodTypes = ['all', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Health & Medical Records</h1>
        <p className="text-gold-100">Manage student health information and medical history</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-beige-200">
        {['profiles', 'history', 'vaccinations'].map(tab => (
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

      {/* Health Profiles Tab */}
      {activeTab === 'profiles' && (
        <>
          {/* Filters and Add */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <select
              value={filterBloodType}
              onChange={(e) => setFilterBloodType(e.target.value)}
              className="px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            >
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'All Blood Types' : type}</option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gold-500 text-white px-6 py-2 rounded-lg hover:bg-gold-600 transition font-medium whitespace-nowrap"
            >
              <FiPlus size={20} />
              Add Profile
            </motion.button>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.length === 0 ? (
              <Card className="text-center py-12 text-gray-500 md:col-span-2 lg:col-span-3">
                <FiActivity size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No health profiles found</p>
              </Card>
            ) : (
              filteredProfiles.map((profile, idx) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="hover:shadow-gold-md transition flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{profile.studentName}</h3>
                          <p className="text-sm text-gray-600">{profile.grade}</p>
                        </div>
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {profile.bloodType}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="text-sm">
                          <p className="text-gray-600">Height / Weight</p>
                          <p className="font-medium text-gray-900">{profile.height} / {profile.weight}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Allergies</p>
                          <p className="font-medium text-gray-900">{profile.allergies || 'None'}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Emergency Contact</p>
                          <p className="font-medium text-gray-900">{profile.emergencyContact}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Last Checkup</p>
                          <p className="font-medium text-gray-900">{profile.lastCheckup}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Vaccinations ({profile.vaccinations.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.vaccinations.map(vac => (
                            <span key={vac} className="inline-block px-2 py-1 bg-gold-100 text-gold-700 rounded text-xs font-medium">
                              {vac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-beige-200">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedProfile(profile)}
                        className="flex-1 flex items-center justify-center gap-2 p-2 text-gold-600 hover:bg-gold-50 rounded-lg transition"
                        title="View details"
                      >
                        <FiEye size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(profile.id)}
                        className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
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

      {/* Medical History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {medicalHistory.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-gold-md transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{record.studentName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{record.date}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Condition</p>
                        <p className="font-medium text-gray-900">{record.condition}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Treatment</p>
                        <p className="font-medium text-gray-900">{record.treatment}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Attending Doctor</p>
                        <p className="font-medium text-gray-900">{record.doctor}</p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <FiEdit2 size={18} />
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vaccinations Tab */}
      {activeTab === 'vaccinations' && (
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Vaccination Summary</h3>
          <div className="space-y-3">
            {['COVID-19', 'Polio', 'MMR', 'Hepatitis B', 'Typhoid', 'Whooping Cough'].map(vaccine => {
              const vaccinated = healthProfiles.filter(p => p.vaccinations.includes(vaccine)).length;
              const percentage = Math.round((vaccinated / healthProfiles.length) * 100);
              return (
                <div key={vaccine}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{vaccine}</span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-beige-200 rounded-full h-2">
                    <div
                      className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
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
                    Add Health Profile
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
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    >
                      {bloodTypes.filter(t => t !== 'all').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="text"
                      placeholder="Current Medications"
                      value={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="text"
                      placeholder="Emergency Contact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />

                    <input
                      type="tel"
                      placeholder="Emergency Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddProfile}
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

export default Health;
