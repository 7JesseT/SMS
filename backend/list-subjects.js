const mongoose = require('mongoose');
require('dotenv').config();

const Subject = require('./models/subjectSchema.js');

const listSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const subjects = await Subject.find().populate('sclassName', 'sclassName').populate('teacher', 'name');
        
        if (subjects.length === 0) {
            console.log('❌ No subjects found in the database');
        } else {
            console.log(`📚 Found ${subjects.length} subject(s):\n`);
            subjects.forEach((subject, index) => {
                console.log(`${index + 1}. Subject Name: ${subject.subName}`);
                console.log(`   Subject Code: ${subject.subCode}`);
                console.log(`   Subject ID: ${subject._id}`);
                console.log(`   Class: ${subject.sclassName?.sclassName || 'N/A'}`);
                console.log(`   Teacher: ${subject.teacher?.name || 'Not assigned'}`);
                console.log(`   Sessions: ${subject.sessions}`);
                console.log('---');
            });
        }

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

listSubjects();
