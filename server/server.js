require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint - must be before other routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI);

const allowedOrigins = [
    'http://localhost:5173', // Your local dev frontend
    'https://dsa-tracker-client.onrender.com' // <-- Your DEPLOYED frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or requests from allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));


app.get('/', (req, res) => res.send('DSA Revision Tracker API running'));

require('./jobs/reminderScheduler');
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));