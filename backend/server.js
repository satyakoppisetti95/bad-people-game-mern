const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');
const path = require('path');

connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize routes
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    );
} else {
    app.get('/', (req, res) => res.send('Unauthorized'));
}

//error handler middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});