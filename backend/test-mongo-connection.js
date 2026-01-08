const mongoose = require('mongoose');

// Test different connection variations
const testConnections = async () => {
    console.log('\n🔍 MongoDB Connection Diagnostics\n');

    // Test 1: Raw connection string (URL encoded password)
    console.log('Test 1: URL-encoded password (@→%40)');
    console.log('String: mongodb+srv://sms:Talemwa123%40@sms.txt8o0u.mongodb.net/sms');
    try {
        await mongoose.connect('mongodb+srv://sms:Talemwa123%40@sms.txt8o0u.mongodb.net/sms?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000
        });
        console.log('✅ SUCCESS: Connected with URL-encoded password\n');
        await mongoose.connection.close();
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}\n`);
    }

    // Test 2: Raw password (no encoding)
    console.log('Test 2: Raw password (no URL encoding)');
    console.log('String: mongodb+srv://sms:Talemwa123@sms.txt8o0u.mongodb.net/sms');
    try {
        await mongoose.connect('mongodb+srv://sms:Talemwa123@sms.txt8o0u.mongodb.net/sms?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000
        });
        console.log('✅ SUCCESS: Connected with raw password\n');
        await mongoose.connection.close();
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}\n`);
    }

    console.log('\n📋 Troubleshooting Checklist:');
    console.log('1. ✅ Check MongoDB Atlas dashboard');
    console.log('   - Go to https://cloud.mongodb.com');
    console.log('   - Select cluster "sms"');
    console.log('   - Click "Connect"');
    console.log('   - Copy the connection string');
    console.log('');
    console.log('2. ✅ Verify Network Access (IP Whitelist)');
    console.log('   - Security → Network Access');
    console.log('   - Should allow 0.0.0.0/0 (all IPs) OR');
    console.log('   - Add your IP: ' + require('os').networkInterfaces());
    console.log('');
    console.log('3. ✅ Verify Database User');
    console.log('   - Database Access → Users');
    console.log('   - User: sms');
    console.log('   - Password: Talemwa123@');
    console.log('   - Role: Built-in Role (Select "Atlas admin" or appropriate role)');
    console.log('');
    console.log('4. ✅ Check Environment Variable');
    console.log('   - .env file MONGO_URI=' + (process.env.MONGO_URI || 'NOT SET'));
    console.log('');
    console.log('5. ✅ If still failing:');
    console.log('   - Reset database user password in MongoDB Atlas');
    console.log('   - Use only alphanumeric characters if possible');
    console.log('   - Update .env file with new password (URL-encoded)');
};

testConnections();
