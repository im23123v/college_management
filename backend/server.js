const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const adminRoutes = require('./routes/adminRoutes');
const developerRoutes = require('./routes/developerRoutes');
const  authRoutes=require('./routes/authRoutes')



const app = express();
const PORT = 5000; 


app.use(cors({
  origin: 'http://localhost:8081', 
  credentials: true,
}));
app.use(express.json()); 


// app.use(session({
//   secret: 'your-secret-key', 
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/yourDB' }),
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, 
//   }
// }));

mongoose.connect('mongodb://127.0.0.1:27017/yourDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/admin', adminRoutes);
app.use('/developer', developerRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Backend server is running!');
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
