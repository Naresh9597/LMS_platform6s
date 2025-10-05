const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const AdminMetrics = require('./models/AdminMetrics');
const StudentData = require('./models/StudentData');
const ChatbotPair = require('./models/ChatbotPair');

// Import your mock data
const { users, adminMetrics, studentData, chatbotPairs } = require('./data/mockdata');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for Seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Seed function
const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await AdminMetrics.deleteMany({});
    await StudentData.deleteMany({});
    await ChatbotPair.deleteMany({});

    console.log('Old data cleared');

    // Insert users
    await User.insertMany(users);
    console.log('Users inserted');

    // Insert admin metrics
    await AdminMetrics.create(adminMetrics);
    console.log('Admin metrics inserted');

    // Insert student data
    await StudentData.create(studentData);
    console.log('Student data inserted');

    // Insert chatbot pairs
    for (const role in chatbotPairs) {
      for (const pair of chatbotPairs[role]) {
        await ChatbotPair.create({ role, ...pair });
      }
    }
    console.log('Chatbot pairs inserted');

    console.log('Seeding completed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
