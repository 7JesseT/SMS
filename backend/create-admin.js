const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Admin = require('./models/adminSchema.js');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@school.com' });
        if (existingAdmin) {
            console.log('❌ Admin already exists with email: admin@school.com');
            process.exit(0);
        }

        // Create new admin
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash('admin123', salt);

        const admin = new Admin({
            name: 'Super Admin',
            email: 'admin@school.com',
            password: hashedPass,
            schoolName: 'Demo School'
        });

        await admin.save();
        console.log('✅ Admin created successfully!');
        console.log('📧 Email: admin@school.com');
        console.log('🔑 Password: admin123');
        console.log('🏫 School: Demo School');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

createAdmin();
