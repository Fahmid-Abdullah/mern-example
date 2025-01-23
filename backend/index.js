// Import the express module to create a server
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import somethingRouter from './routes/somethingRoute.js';

// Load environment variables from the .env file into process.env
import dotenv from 'dotenv';
dotenv.config();

// Create an instance of an Express application
const app = express();

// Use the PORT variable from the .env file to specify the port the server will listen on
const PORT = process.env.PORT;
const mongoDBUrl = process.env.MONGODB_URL

// Middleware for CORS - Allow all origins
app.use(cors());

// Middleware between front-end to back-end
app.use(express.json());

// endpoints
app.use("/something", somethingRouter)

mongoose
    .connect(mongoDBUrl)
    .then(() => {
        console.log('Database Connected.');
        // Start the server and make it listen on the specified port
        app.listen(PORT, () => {
            // Log a message to the console indicating that the server is running
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    })