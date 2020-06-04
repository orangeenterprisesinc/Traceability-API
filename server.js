const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const locations = require('./routes/locations');
const codes = require('./routes/codes');
const customers = require('./routes/customers');
const auth = require('./routes/auth');
// const combined = require('./routes/combined');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers, versioning the api in the route
app.use('/api/v1/locations', locations);
app.use('/api/v1/codes', codes);
app.use('/api/v1/auth', auth);
app.use('/api/v1/customers', customers);
// app.use('/api/v1/combined', combined);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('<h1>Hello from express</h1>');
});

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});