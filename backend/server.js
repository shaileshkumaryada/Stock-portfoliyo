const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));

app.listen(5000, () => console.log('Server running on port 5000'));
