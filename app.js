import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userroutes from "./routes/user.routes.js";
import projectroutes from "./routes/project.routes.js"; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import airoutes from "./routes/ai.routes.js"


// Connect to the database
connect();

const app = express();

// Middleware to log requests
app.use(morgan('dev'));
app.use(cors());
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Define routes (must come after middleware)
app.use('/users', userroutes);
app.use('/projects',projectroutes);
app.use('/ai',airoutes);


// Test route
app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;
