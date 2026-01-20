// Mock data for The Heart of Our Father School Manager
// This is the single source of truth for demo data

const generateStudents = () => {
  const classes = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  const guardianRelations = ['Father', 'Mother', 'Uncle', 'Aunt', 'Grandmother', 'Grandfather'];
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Biology', 'Physics', 'Chemistry', 'History', 'Literature', 'Civic Education'];

  const students = [];
  const firstNames = [
    'Chisom', 'Adekunle', 'Zainab', 'Emeka', 'Busola', 'Kenji', 'Amara', 'David',
    'Fatima', 'Ibrahim', 'Blessing', 'Taiwo', 'Ngozi', 'Kunle', 'Tunde', 'Ada',
    'Okoro', 'Janet', 'Seun', 'Grace'
  ];
  const lastNames = [
    'Okonkwo', 'Adeyemi', 'Hassan', 'Nwosu', 'Olawale', 'Ibrahim', 'Eze', 'Kolade',
    'Abubakar', 'Ifeanyi', 'Okafor', 'Obi', 'Kamara', 'Mensah', 'Otoo', 'Bello'
  ];

  for (let i = 1; i <= 25; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const admissionYear = 2022 + Math.floor(Math.random() * 2);
    const gradeSubjects = {};
    subjects.forEach((subject) => {
      gradeSubjects[subject] = Math.floor(Math.random() * 30) + 60; // 60-90 score
    });

    students.push({
      id: `STU${String(i).padStart(3, '0')}`,
      firstName,
      lastName,
      photo: `https://i.pravatar.cc/150?img=${i + 100}`,
      admissionNo: `ADM${admissionYear}${String(i).padStart(3, '0')}`,
      class: classes[Math.floor(Math.random() * classes.length)],
      dob: `200${Math.floor(Math.random() * 7)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      guardian: {
        name: `${firstName} Parent`,
        phone: `+234${String(Math.floor(Math.random() * 9000000000) + 1000000000).slice(0, 10)}`,
        relation: guardianRelations[Math.floor(Math.random() * guardianRelations.length)],
      },
      contact: {
        phone: `+234${String(Math.floor(Math.random() * 9000000000) + 1000000000).slice(0, 10)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.hof.school`,
      },
      attendancePercent: Math.floor(Math.random() * 30) + 70, // 70-100%
      grades: gradeSubjects,
      health: {
        allergies: Math.random() > 0.7 ? ['Peanuts', 'Dairy'] : [],
        bloodGroup: ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-'][Math.floor(Math.random() * 6)],
      },
      hostelRoom: Math.random() > 0.3 ? `Room ${Math.floor(Math.random() * 100) + 101}` : null,
      libraryBorrowed: [
        { bookId: `BOOK${Math.floor(Math.random() * 50)}`, borrowDate: '2025-12-01', dueDate: '2025-12-15', returned: false },
        { bookId: `BOOK${Math.floor(Math.random() * 50)}`, borrowDate: '2025-11-15', dueDate: '2025-11-29', returned: true },
      ],
      createdAt: '2023-08-15T10:30:00Z',
      updatedAt: new Date().toISOString(),
    });
  }

  return students;
};

const generateTeachers = () => {
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Biology', 'Physics', 'Chemistry', 'History', 'Literature', 'Civic Education', 'Computer Science', 'Physical Education'];
  const firstNames = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  const lastNames = ['Okafor', 'Adeyemi', 'Hassan', 'Nwosu', 'Olawale', 'Ibrahim', 'Eze', 'Kolade', 'Abubakar', 'Ifeanyi'];

  const teachers = [];
  for (let i = 1; i <= 15; i++) {
    const title = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const numSubjects = Math.floor(Math.random() * 3) + 1;
    const assignedSubjects = [];
    for (let j = 0; j < numSubjects; j++) {
      assignedSubjects.push(subjects[Math.floor(Math.random() * subjects.length)]);
    }

    teachers.push({
      id: `TCH${String(i).padStart(3, '0')}`,
      name: `${title} ${lastName}`,
      photo: `https://i.pravatar.cc/150?img=${i + 50}`,
      subjects: [...new Set(assignedSubjects)],
      email: `${lastName.toLowerCase()}@hof.school`,
      phone: `+234${String(Math.floor(Math.random() * 9000000000) + 1000000000).slice(0, 10)}`,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
      workload: Math.floor(Math.random() * 40) + 20, // 20-60 hours/week
      specialization: subjects[Math.floor(Math.random() * subjects.length)],
      yearsOfExperience: Math.floor(Math.random() * 20) + 1,
      qualification: ['B.Ed', 'M.Ed', 'B.Sc', 'M.Sc'][Math.floor(Math.random() * 4)],
      createdAt: '2023-01-01T08:00:00Z',
      updatedAt: new Date().toISOString(),
    });
  }

  return teachers;
};

const generateMessages = () => {
  const messages = [];
  const folders = ['inbox', 'sent', 'drafts'];
  const senderIds = ['TCH001', 'TCH002', 'ADM001', 'ADM002'];
  const recipientIds = ['STU001', 'STU002', 'STU003', 'PAR001', 'PAR002', 'ADM001'];

  const messageTemplates = [
    { subject: 'Class Performance Review', body: 'Your recent performance in class has been good. Keep up the hard work!' },
    { subject: 'Assignment Submission', body: 'Please submit your project by the due date. Late submissions will attract penalties.' },
    { subject: 'Parent-Teacher Meeting', body: 'We have scheduled a meeting to discuss your child\'s progress.' },
    { subject: 'Attendance Notice', body: 'Your attendance has dropped. Please ensure regular attendance.' },
    { subject: 'Exam Schedule', body: 'The exams will begin on January 20. Study hard and good luck!' },
    { subject: 'Extracurricular Activities', body: 'Register for our new sports and music programs.' },
    { subject: 'Uniform Reminder', body: 'Remember to wear the complete uniform as per school policy.' },
    { subject: 'Fees Payment', body: 'Kindly pay your school fees on time to avoid late penalties.' },
    { subject: 'Health Checkup', body: 'All students are required to undergo health checkup this week.' },
    { subject: 'Library Book Overdue', body: 'You have an overdue library book. Please return it immediately.' },
  ];

  for (let i = 0; i < 60; i++) {
    const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    const folder = folders[Math.floor(Math.random() * folders.length)];
    const senderId = senderIds[Math.floor(Math.random() * senderIds.length)];
    const recipientId = recipientIds[Math.floor(Math.random() * recipientIds.length)];
    const daysAgo = Math.floor(Math.random() * 60);

    messages.push({
      id: `MSG${String(i).padStart(4, '0')}`,
      from: senderId,
      to: [recipientId],
      subject: template.subject,
      body: template.body,
      folder,
      read: folder === 'sent' || Math.random() > 0.3,
      sentAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      attachments: [],
    });
  }

  return messages;
};

const generateInventory = () => {
  const items = [];
  const categories = ['Stationery', 'Furniture', 'Sports Equipment', 'Lab Equipment', 'ICT Resources', 'Library Books', 'Cleaning Supplies'];
  const locations = ['Store Room A', 'Store Room B', 'Classroom Block', 'Science Lab', 'Computer Lab', 'Library', 'Sports Field'];

  const itemNames = {
    Stationery: ['Notebooks', 'Pens', 'Pencils', 'Erasers', 'Rulers', 'Geometry Sets', 'Markers'],
    Furniture: ['Desks', 'Chairs', 'Cabinets', 'Shelves', 'Tables', 'Lockers'],
    'Sports Equipment': ['Footballs', 'Volleyballs', 'Basketballs', 'Badminton Sets', 'Tennis Rackets', 'Hurdles'],
    'Lab Equipment': ['Microscopes', 'Bunsen Burners', 'Test Tubes', 'Beakers', 'Flasks', 'Pipettes'],
    'ICT Resources': ['Laptops', 'Projectors', 'Printers', 'Scanners', 'Keyboards', 'Mice'],
    'Library Books': ['Fiction Books', 'Reference Books', 'Encyclopedia', 'Dictionaries', 'Biographies'],
    'Cleaning Supplies': ['Brooms', 'Mops', 'Disinfectants', 'Soap', 'Paper Towels']
  };

  let itemId = 1;
  for (const category of categories) {
    const categoryItems = itemNames[category];
    for (const itemName of categoryItems) {
      items.push({
        id: `INV${String(itemId).padStart(4, '0')}`,
        name: itemName,
        category,
        quantity: Math.floor(Math.random() * 200) + 10,
        minThreshold: Math.floor(Math.random() * 20) + 5,
        location: locations[Math.floor(Math.random() * locations.length)],
        price: Math.floor(Math.random() * 50000) + 1000,
        depreciationRate: (Math.random() * 10 + 5).toFixed(2), // 5-15% per year
        lastUpdated: new Date().toISOString(),
      });
      itemId++;
    }
  }

  return items;
};

const generateTransport = () => {
  const routes = ['Ikeja Route', 'Lekki Route', 'Ikoyi Route', 'VI Route', 'Ajah Route', 'Badore Route'];
  const drivers = ['Mr. Adebayo', 'Mr. Okafor', 'Mr. Hassan', 'Mr. Kunle', 'Mr. Ibrahim'];

  const buses = [];
  for (let i = 1; i <= 8; i++) {
    buses.push({
      id: `BUS${String(i).padStart(3, '0')}`,
      plate: `LSD ${String(i).padStart(3, '0')} AA`,
      capacity: 50 + i * 5,
      route: routes[Math.floor(Math.random() * routes.length)],
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      driverPhone: `+234${String(Math.floor(Math.random() * 9000000000) + 1000000000).slice(0, 10)}`,
      status: Math.random() > 0.1 ? 'Active' : 'Maintenance',
      currentLocation: 'School',
      lastMaintenance: '2025-10-15',
      nextMaintenance: '2026-01-15',
    });
  }

  const planes = [];
  for (let i = 1; i <= 2; i++) {
    planes.push({
      id: `PLN${String(i).padStart(3, '0')}`,
      name: `Charter Flight ${i}`,
      capacity: 120,
      status: 'Available',
      lastUsed: '2025-11-01',
    });
  }

  return { buses, planes };
};

const generateLibrary = () => {
  const bookTitles = [
    'To Kill a Mockingbird', 'Pride and Prejudice', 'The Great Gatsby', '1984', 'Jane Eyre',
    'Wuthering Heights', 'The Catcher in the Rye', 'Lord of the Flies', 'Animal Farm', 'Brave New World',
    'The Odyssey', 'Don Quixote', 'Crime and Punishment', 'The Brothers Karamazov', 'Moby Dick',
    'A Tale of Two Cities', 'The Grapes of Wrath', 'Of Mice and Men', 'The Old Man and the Sea', 'Catch-22'
  ];

  const authors = [
    'Harper Lee', 'Jane Austen', 'F. Scott Fitzgerald', 'George Orwell', 'Charlotte Brontë',
    'Emily Brontë', 'J.D. Salinger', 'William Golding', 'Homer', 'Miguel Cervantes'
  ];

  const books = [];
  for (let i = 0; i < 30; i++) {
    const title = bookTitles[Math.floor(Math.random() * bookTitles.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    books.push({
      id: `BOOK${String(i).padStart(4, '0')}`,
      ISBN: `978${String(Math.floor(Math.random() * 1000000000000)).padStart(13, '0')}`,
      title: `${title} - Edition ${i + 1}`,
      author,
      copies: Math.floor(Math.random() * 5) + 1,
      availableCopies: Math.floor(Math.random() * 5) + 1,
      location: `Shelf ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      publicationYear: 1900 + Math.floor(Math.random() * 124),
      category: ['Fiction', 'Non-Fiction', 'Reference', 'Biography', 'Science'][Math.floor(Math.random() * 5)],
      issuedRecords: [],
    });
  }

  return books;
};

const generateHostel = () => {
  const rooms = [];
  const blocks = ['Block A', 'Block B', 'Block C'];

  for (const block of blocks) {
    for (let i = 1; i <= 20; i++) {
      const roomNumber = `${block}-${String(i).padStart(3, '0')}`;
      const capacity = Math.random() > 0.5 ? 2 : 3;
      const occupancy = Math.floor(Math.random() * (capacity + 1));

      rooms.push({
        id: `ROOM${String(rooms.length).padStart(4, '0')}`,
        roomNumber,
        block,
        capacity,
        occupancy,
        students: [],
        amenities: ['Bed', 'Wardrobe', 'Table', 'Chair'],
        conditions: Math.random() > 0.2 ? 'Good' : 'Need Repair',
        lastInspection: '2025-11-01',
      });
    }
  }

  const visitorLogs = [];
  for (let i = 0; i < 15; i++) {
    visitorLogs.push({
      id: `VIS${String(i).padStart(4, '0')}`,
      visitorName: `Visitor ${i + 1}`,
      studentId: `STU${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`,
      visitDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      visitTime: `${String(Math.floor(Math.random() * 14) + 8).padStart(2, '0')}:00`,
      duration: Math.floor(Math.random() * 3) + 1, // hours
      purpose: ['Family Visit', 'Emergency', 'Birthday Celebration'][Math.floor(Math.random() * 3)],
    });
  }

  return { rooms, visitorLogs };
};

const generateHealth = () => {
  const records = [];

  const visitReasons = ['Malaria', 'Cough', 'Headache', 'Fever', 'Injury', 'Routine Checkup', 'Dental Checkup', 'Eye Test'];
  const vaccinations = ['Polio', 'MMR', 'Typhoid', 'Yellow Fever', 'COVID-19'];

  // Medical visits
  for (let i = 0; i < 40; i++) {
    records.push({
      id: `HEALTH${String(i).padStart(4, '0')}`,
      studentId: `STU${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`,
      type: 'Visit',
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reason: visitReasons[Math.floor(Math.random() * visitReasons.length)],
      diagnosis: 'Minor illness - advised rest',
      treatment: 'Prescribed medication',
      notes: 'Student advised to take rest and maintain hygiene',
    });
  }

  // Vaccinations
  for (let i = 40; i < 60; i++) {
    records.push({
      id: `HEALTH${String(i).padStart(4, '0')}`,
      studentId: `STU${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`,
      type: 'Vaccination',
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      vaccination: vaccinations[Math.floor(Math.random() * vaccinations.length)],
      nurse: `Nurse ${String(Math.floor(Math.random() * 5) + 1)}`,
      site: 'Left Arm',
      notes: 'Vaccination administered successfully',
    });
  }

  return records;
};

const generateAccounts = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const incomeCategories = ['Tuition Fees', 'Examination Fees', 'Hostel Fees', 'Transport Fees', 'Donations'];
  const expenseCategories = ['Staff Salaries', 'Utilities', 'Maintenance', 'Supplies', 'Food Services', 'Transportation'];

  const incomes = [];
  const expenses = [];

  for (const month of months) {
    for (const category of incomeCategories) {
      incomes.push({
        id: `INC${String(incomes.length).padStart(5, '0')}`,
        month,
        category,
        amount: Math.floor(Math.random() * 5000000) + 1000000, // ₦1M - ₦6M
        date: `2025-${String(months.indexOf(month) + 1).padStart(2, '0')}-15`,
      });
    }

    for (const category of expenseCategories) {
      expenses.push({
        id: `EXP${String(expenses.length).padStart(5, '0')}`,
        month,
        category,
        amount: Math.floor(Math.random() * 3000000) + 500000, // ₦500K - ₦3.5M
        date: `2025-${String(months.indexOf(month) + 1).padStart(2, '0')}-10`,
      });
    }
  }

  return { incomes, expenses };
};

const generateReports = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Attendance trend
  const attendanceData = months.map((month) => ({
    month,
    percentage: Math.floor(Math.random() * 20) + 75, // 75-95%
  }));

  // Grades distribution
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Biology'];
  const gradesData = subjects.map((subject) => ({
    subject,
    average: Math.floor(Math.random() * 30) + 60, // 60-90
  }));

  // Financial report
  const financialData = months.slice(0, 6).map((month) => ({
    month,
    income: Math.floor(Math.random() * 5000000) + 2000000,
    expense: Math.floor(Math.random() * 3000000) + 1000000,
  }));

  // Teacher ratings
  const teacherRatings = [
    { name: 'Mr. Okafor', rating: 4.8 },
    { name: 'Mrs. Adeyemi', rating: 4.5 },
    { name: 'Mr. Hassan', rating: 4.2 },
    { name: 'Ms. Ibrahim', rating: 4.7 },
    { name: 'Dr. Nwosu', rating: 4.9 },
  ];

  return {
    attendance: attendanceData,
    grades: gradesData,
    financial: financialData,
    teacherRatings,
  };
};

const generateEvents = () => {
  const events = [];
  const eventTypes = ['Prayer Service', 'Thanksgiving', 'Bible Study', 'Spiritual Retreat', 'Chapel Service'];
  const venues = ['Main Hall', 'Chapel', 'Sports Field', 'Auditorium'];

  for (let i = 0; i < 20; i++) {
    const daysFromNow = Math.floor(Math.random() * 180) - 90; // Past and future events
    events.push({
      id: `EVT${String(i).padStart(4, '0')}`,
      title: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      date: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 14) + 7).padStart(2, '0')}:00`,
      venue: venues[Math.floor(Math.random() * venues.length)],
      description: 'Important spiritual event for all students and staff',
      attendance: Math.floor(Math.random() * 500) + 100,
      coordinator: `Staff Member ${Math.floor(Math.random() * 10) + 1}`,
    });
  }

  return events;
};

// Generate demo users for role-based access
const generateUsers = () => {
  return [
    {
      id: 'USR-0001',
      name: 'Admin User',
      email: 'admin@hof.local',
      password: 'demo1234',
      role: 'admin',
      permissions: ['*'],
      avatar: 'https://i.pravatar.cc/150?img=5',
      createdAt: '2025-01-01T08:00:00Z',
    },
    {
      id: 'TCH-0001',
      name: 'Ms. Grace Namusoke',
      email: 'grace@hof.local',
      password: 'demo1234',
      role: 'teacher',
      permissions: [
        'students.read_own',
        'students.update',
        'messages.send_class',
        'messages.read_all',
        'discipline.report',
        'reports.view',
        'reports.export',
        'teachers.update',
        'assignments.manage',
        'attendance.mark',
        'attendance.read',
        'accounts.read',
        'library.read',
        'health.read',
      ],
      teacherId: 'TCH-0001',
      classes: ['JSS1', 'JSS2'],
      subjects: ['Mathematics', 'Physics'],
      avatar: 'https://i.pravatar.cc/150?img=12',
      createdAt: '2025-01-01T08:00:00Z',
    },
    {
      id: 'TCH-0002',
      name: 'Mr. John Okafor',
      email: 'john@hof.local',
      password: 'demo1234',
      role: 'teacher',
      permissions: [
        'students.read_own',
        'students.update',
        'messages.send_class',
        'messages.read_all',
        'discipline.report',
        'reports.view',
        'reports.export',
        'teachers.update',
        'assignments.manage',
        'attendance.mark',
        'attendance.read',
        'accounts.read',
        'library.read',
        'health.read',
      ],
      teacherId: 'TCH-0002',
      classes: ['SS1', 'SS2'],
      subjects: ['English', 'Literature'],
      avatar: 'https://i.pravatar.cc/150?img=20',
      createdAt: '2025-01-01T08:00:00Z',
    },
    {
      id: 'PAR-0001',
      name: 'Parent User',
      email: 'parent1@example.com',
      password: 'demo1234',
      role: 'parent',
      permissions: [
        'students.read_own',
        'messages.read_own',
        'assignments.read',
        'accounts.read',
        'attendance.read',
      ],
      linkedStudentId: 'STU001',
      avatar: 'https://i.pravatar.cc/150?img=30',
      createdAt: '2025-01-01T08:00:00Z',
    },
    {
      id: 'STU-0001',
      name: 'Student User',
      email: 'student1@example.com',
      password: 'demo1234',
      role: 'student',
      permissions: [
        'students.read_own',
        'messages.read_own',
        'assignments.read',
        'accounts.read',
        'attendance.read',
      ],
      studentId: 'STU001',
      avatar: 'https://i.pravatar.cc/150?img=32',
      createdAt: '2025-01-01T08:00:00Z',
    },
  ];
};

// Export the complete mock data
export const dummyData = {
  students: generateStudents(),
  teachers: generateTeachers(),
  messages: generateMessages(),
  inventory: generateInventory(),
  transport: generateTransport(),
  library: generateLibrary(),
  hostel: generateHostel(),
  health: generateHealth(),
  accounts: generateAccounts(),
  reports: generateReports(),
  events: generateEvents(),
  users: generateUsers(),
};

// Default export
export default dummyData;
