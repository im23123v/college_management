const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const developerRoutes = require('./routes/developerRoutes');
const  authRoutes=require('./routes/authRoutes')
const app = express();
const PORT = 5000; 
require('dotenv').config();


app.use(cors({
  origin: 'http://192.168.95.223:8081', 
  credentials: true,
}));
app.use(express.json()); 




mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/admin', adminRoutes);
app.use('/developer', developerRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Backend server is running!');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});