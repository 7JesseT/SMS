import { dummyData } from '../mocks/dummyData';

// Utility to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate random error (10% chance)
const maybeError = () => {
  if (Math.random() < 0.1) {
    throw new Error('Network error. Please try again.');
  }
};

// Deep clone to prevent mutations
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Students API
export const fetchStudents = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.students);
};

export const fetchStudentById = async (id) => {
  await delay(Math.random() * 500 + 200);
  maybeError();
  const student = dummyData.students.find((s) => s.id === id);
  if (!student) throw new Error('Student not found');
  return deepClone(student);
};

export const updateStudent = async (id, payload) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const index = dummyData.students.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Student not found');
  dummyData.students[index] = { ...dummyData.students[index], ...payload, updatedAt: new Date().toISOString() };
  return deepClone(dummyData.students[index]);
};

export const addStudent = async (payload) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const newId = `STU${String(dummyData.students.length + 1).padStart(3, '0')}`;
  const newStudent = {
    id: newId,
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dummyData.students.push(newStudent);
  return deepClone(newStudent);
};

export const deleteStudent = async (id) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const index = dummyData.students.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Student not found');
  dummyData.students.splice(index, 1);
  return { success: true, id };
};

// Teachers API
export const fetchTeachers = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.teachers);
};

export const fetchTeacherById = async (id) => {
  await delay(Math.random() * 500 + 200);
  maybeError();
  const teacher = dummyData.teachers.find((t) => t.id === id);
  if (!teacher) throw new Error('Teacher not found');
  return deepClone(teacher);
};

export const updateTeacher = async (id, payload) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const index = dummyData.teachers.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Teacher not found');
  dummyData.teachers[index] = { ...dummyData.teachers[index], ...payload, updatedAt: new Date().toISOString() };
  return deepClone(dummyData.teachers[index]);
};

// Messages API
export const fetchMessages = async (folder = 'inbox') => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  const messages = dummyData.messages.filter((m) => m.folder === folder);
  return deepClone(messages);
};

export const fetchMessageThreads = async (userId) => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  const threads = dummyData.messages.filter(
    (m) => m.from === userId || (Array.isArray(m.to) && m.to.includes(userId))
  );
  return deepClone(threads);
};

export const sendMessage = async (payload) => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  const newMessage = {
    id: `MSG${String(dummyData.messages.length).padStart(4, '0')}`,
    ...payload,
    folder: 'sent',
    read: true,
    sentAt: new Date().toISOString(),
  };
  dummyData.messages.push(newMessage);
  return deepClone(newMessage);
};

export const markMessageAsRead = async (id) => {
  await delay(Math.random() * 300 + 100);
  maybeError();
  const message = dummyData.messages.find((m) => m.id === id);
  if (!message) throw new Error('Message not found');
  message.read = true;
  return deepClone(message);
};

// Inventory API
export const fetchInventory = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.inventory);
};

export const updateInventory = async (id, payload) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const index = dummyData.inventory.findIndex((i) => i.id === id);
  if (index === -1) throw new Error('Item not found');
  dummyData.inventory[index] = { ...dummyData.inventory[index], ...payload, lastUpdated: new Date().toISOString() };
  return deepClone(dummyData.inventory[index]);
};

// Transport API
export const fetchTransport = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.transport);
};

export const updateBus = async (id, payload) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const bus = dummyData.transport.buses.find((b) => b.id === id);
  if (!bus) throw new Error('Bus not found');
  Object.assign(bus, payload);
  return deepClone(bus);
};

// Library API
export const fetchLibrary = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.library);
};

export const borrowBook = async (studentId, bookId) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const book = dummyData.library.find((b) => b.id === bookId);
  if (!book) throw new Error('Book not found');
  if (book.availableCopies <= 0) throw new Error('No copies available');
  book.availableCopies -= 1;
  return deepClone(book);
};

// Hostel API
export const fetchHostel = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.hostel);
};

export const updateRoom = async (roomId, payload) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const room = dummyData.hostel.rooms.find((r) => r.id === roomId);
  if (!room) throw new Error('Room not found');
  Object.assign(room, payload);
  return deepClone(room);
};

// Health API
export const fetchHealth = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.health);
};

export const addHealthRecord = async (payload) => {
  await delay(Math.random() * 600 + 200);
  maybeError();
  const newRecord = {
    id: `HEALTH${String(dummyData.health.length).padStart(4, '0')}`,
    ...payload,
  };
  dummyData.health.push(newRecord);
  return deepClone(newRecord);
};

// Accounts API
export const fetchAccounts = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.accounts);
};

// Reports API
export const fetchReports = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.reports);
};

// Events API
export const fetchEvents = async () => {
  await delay(Math.random() * 700 + 200);
  maybeError();
  return deepClone(dummyData.events);
};

// Admin API
export const resetDatabase = async () => {
  await delay(1000);
  localStorage.removeItem('hof_data');
  localStorage.removeItem('hof_user');
  // Re-export fresh data would require reimporting, but we simulate the reset
  return { success: true };
};

export const exportData = async () => {
  await delay(500);
  return deepClone(dummyData);
};

export const importData = async (data) => {
  await delay(500);
  Object.assign(dummyData, data);
  return { success: true };
};
// ============================================
// Lightweight Meta Endpoints (for Dashboard)
// ============================================
// These return minimal data quickly for dashboard summary cards
export const fetchDashboardMeta = async () => {
  await delay(150); // Very quick response
  return {
    totalStudents: dummyData.students.length,
    totalTeachers: dummyData.teachers.length,
    totalMessages: dummyData.messages.length,
    activeUsers: Math.floor(dummyData.students.length * 0.85),
    avgAttendance: 92.5,
  };
};

// Lightweight student count with recent 5
export const fetchStudentsMeta = async () => {
  await delay(200);
  return {
    total: dummyData.students.length,
    recent: deepClone(dummyData.students.slice(0, 5)),
  };
};

// Paginated students for large lists
export const fetchStudentsPaginated = async (page = 1, perPage = 20) => {
  await delay(300);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    students: deepClone(dummyData.students.slice(start, end)),
    total: dummyData.students.length,
    page,
    perPage,
    totalPages: Math.ceil(dummyData.students.length / perPage),
  };
};