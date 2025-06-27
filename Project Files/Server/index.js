const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));         // Login, signup
app.use('/api/users', require('./routes/users'));       // Profile, me, etc.
app.use('/api/admin', require('./routes/admin'));       // Admin operations

// ✅ Import and Use Course Routes
const courseRoutes = require('./routes/courses');       // ✅ Import here
app.use('/api/courses', courseRoutes);                  // ✅ Mount route here

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.log('❌ MongoDB connection error:', err));

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
