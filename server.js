const express = require('express');
const db = require('./config/db');
const path = require('path');

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

// Server static assets in production
if (process.env.NOVE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 3080

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
