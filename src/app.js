const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const onPreResponse = require('./middlewares/onPreResponse');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/profiles', express.static(path.join(__dirname, '../uploads/profiles')));

app.use('/api/users', userRoutes);
app.use('/api/authentications', authenticationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use(onPreResponse);

module.exports = app;
