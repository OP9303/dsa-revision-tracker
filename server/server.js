require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI);


app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));


app.get('/', (req, res) => res.send('DSA Revision Tracker API running'));

require('./jobs/reminderScheduler');
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));