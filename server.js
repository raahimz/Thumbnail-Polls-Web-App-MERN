const express = require('express');
const db = require('./config/db');

const app = express();

// CORS
const cors = require('cors');
app.use(cors())

// Connect to DB
db();

// Init middleware
app.use(express.json());

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 3080

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
