const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

//middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://task-manager-kohl-delta.vercel.app'],
    credentials: true
}));
app.use(express.json())

//test route
app.get('/',(req,res)=>{
    res.json({message:'Task Manager API is running'});
})

app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);

//connect to mongodb and start server

mongoose.connect(process.env.MONGO_URI)
    .then (()=>{
        console.log('MongoDB Connected');
        app.listen(process.env.PORT || 5000,()=>{
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch ((err)=>console.log('DB connection error:',err));
