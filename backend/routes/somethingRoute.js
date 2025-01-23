import express from "express"; // Importing the express framework
import { Something } from "../models/somethingModel.js"; // Import the "Something" model to interact with the database

const router = express.Router(); // Creating an express router instance for handling routes

// Route to add a new "something"
router.post("/something", async (req, res) => {
    const { title, year } = req.body; // Destructure title and year from the request body

    try {
        const newSomething = new Something({ title, year }); // Create a new "something" document with the provided title and year
        await newSomething.save(); // Save the new document to the MongoDB database
        res.status(201).json({ message: "Something added successfully", newSomething }); // Respond with success message and the newly created object
    } catch (error) {
        res.status(500).json({ message: "Error adding something", error }); // If there's an error, respond with an error message
    }
});

// Route to see all "somethings"
router.get("/somethings", async (req, res) => {
    try {
        const somethings = await Something.find(); // Fetch all documents of "Something" from the database
        res.status(200).json(somethings); // Respond with a 200 status and the fetched data
    } catch (error) {
        res.status(500).json({ message: "Error fetching somethings", error }); // If an error occurs, respond with an error message
    }
});

// Route to find a specific "something" by title
router.get("/something/:title", async (req, res) => {
    const { title } = req.params; // Get the title parameter from the route

    try {
        const something = await Something.findOne({ title }); // Search for the "something" by the title in the database
        if (!something) {
            return res.status(404).json({ message: "Something not found" }); // If no "something" is found, respond with a 404 error
        }
        res.status(200).json(something); // If found, respond with the "something" data
    } catch (error) {
        res.status(500).json({ message: "Error finding something", error }); // If an error occurs, respond with an error message
    }
});

// Route to delete a "something" by title
router.delete("/something/:title", async (req, res) => {
    const { title } = req.params; // Get the title parameter from the route

    try {
        const deletedSomething = await Something.findOneAndDelete({ title }); // Delete the "something" from the database by title
        if (!deletedSomething) {
            return res.status(404).json({ message: "Something not found to delete" }); // If no "something" is found to delete, respond with a 404 error
        }
        res.status(200).json({ message: "Something deleted successfully" }); // Respond with a success message once deletion is successful
    } catch (error) {
        res.status(500).json({ message: "Error deleting something", error }); // If an error occurs during deletion, respond with an error message
    }
});

export default router; // Export the router to be used in the main app
