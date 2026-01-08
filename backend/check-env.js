require('dotenv').config();

console.log('🔍 Environment Check:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('MONGO_URI length:', process.env.MONGO_URI?.length);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
