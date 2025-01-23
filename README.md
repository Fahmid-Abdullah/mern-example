# Full-Stack MERN Guide

This guide will walk you through setting up a MERN-like full-stack application using React for the frontend, Express for the backend, and MongoDB for the database.

## Step 1: Create Folder Structure

1. Create a main folder.
2. Inside the main folder, create two subfolders: `frontend` and `backend`.

---

## Step 2: Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Initialize a new Node.js project and install required dependencies:
   ```bash
   npm init -y
   npm i mongoose express nodemon dotenv cors
   ```

3. Open the `package.json` file and update the `scripts` and `type` fields:
   ```json
   "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js"
   },
   "type": "module"
   ```

4. Create a `.env` file in the `backend` folder and add the following:
   ```env
   PORT=5000
   ```

5. Create an `index.js` file in the `backend` folder and add the following code:
   ```javascript
   import express from 'express'; // Import Express to set up the server
   import dotenv from 'dotenv'; // Import dotenv to load environment variables
   dotenv.config(); // Configure dotenv to load variables from the `.env` file
   
   const app = express(); // Initialize an Express application
   const PORT = process.env.PORT; // Get the port from the environment variables
   
   // Define a route for the root URL
   app.get('/', (req, res) => {
       res.send('Hello, world!'); // Respond with "Hello, world!" when this route is hit
   });
   
   // Start the server and listen on the specified port
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`); // Log a message once the server starts
   });
   ```

6. Run the backend server:
   ```bash
   npm run dev
   ```

7. Visit [http://localhost:5000/](http://localhost:5000/) in your browser to verify the server is working.

---

## Step 3: MongoDB Setup

1. Sign in to [MongoDB](https://www.mongodb.com/).

2. Create a new project:
   - Click the dropdown on the top left and select **New Project**.
   - Enter a project name and click **Create Project**.

3. Create a cluster:
   - Under the **Overview** tab, click **Create a Cluster**.
   - Select the **Free Cluster** option, give it a name, and click **Create Deployment**.

4. Add a database user:
   - Copy the username and password displayed in the popup and click **Create Database User**.
   - Close the popup.

5. Allow access from anywhere:
   - Go to **Network Access** on the left sidebar.
   - Click **Edit** under actions and select **Allow Access From Anywhere**.
   - Confirm the changes.

6. Connect to the cluster:
   - Go back to **Clusters** and click **Connect**.
   - Select **Drivers** and copy the connection string under **3. Add your connection string into your application code**.

7. Update the `.env` file with your MongoDB URL:
   ```env
   MONGODB_URL={YOUR_CONNECTION_STRING}
   ```
   Replace `{YOUR_CONNECTION_STRING}` with the copied URL and replace `<db_password>` with the password you saved earlier.

---

## Step 4: Backend - Database Integration

1. Update `index.js` to connect to MongoDB:
   ```javascript
   import express from 'express'; // Import Express for server setup
   import mongoose from 'mongoose'; // Import Mongoose for MongoDB integration
   import dotenv from 'dotenv'; // Import dotenv to use environment variables
   dotenv.config(); // Configure dotenv to read `.env` file
   
   const app = express(); // Create an Express application
   const PORT = process.env.PORT; // Load the port number from the `.env` file
   const mongoDBUrl = process.env.MONGODB_URL; // Load MongoDB URL from `.env` file
   
   // Define a route for the root URL
   app.get('/', (req, res) => {
       res.send('Hello, world!'); // Respond with "Hello, world!" for this route
   });
   
   // Connect to MongoDB
   mongoose
       .connect(mongoDBUrl) // Use the connection string from the `.env` file
       .then(() => {
           console.log('Database Connected.'); // Log a success message when connected
           app.listen(PORT, () => {
               console.log(`Server is running on port ${PORT}`); // Start the server after DB connection
           });
       })
       .catch((error) => {
           console.log(error); // Log an error if the connection fails
       });
   ```

2. Create a `models` folder inside the `backend` folder.
3. Add a `somethingModel.js` file in the `models` folder:
   ```javascript
   import mongoose from 'mongoose'; // Import Mongoose to define a schema and model
   
   // Define a schema for the `Something` collection
   const somethingSchema = mongoose.Schema({
       title: {
           type: String, // The `title` field is a string
           required: true, // It is required
       },
       year: {
           type: Number, // The `year` field is a number
           required: true, // It is also required
       }
   });
   
   // Export the `Something` model based on the schema
   export const Something = mongoose.model('Something', somethingSchema);
   ```

4. Create a `routes` folder inside the `backend` folder.
5. Add a `somethingRoute.js` file in the `routes` folder:
   ```javascript
   import express from 'express'; // Import Express to create a router
   import { Something } from '../models/somethingModel.js'; // Import the `Something` model
   
   const router = express.Router(); // Create a router instance
   
   // POST route to add a new item
   router.post("/something", async (req, res) => {
       const { title, year } = req.body; // Destructure the `title` and `year` from the request body
       try {
           const newSomething = new Something({ title, year }); // Create a new `Something` document
           await newSomething.save(); // Save the document to the database
           res.status(201).json({ message: "Something added successfully", newSomething }); // Respond with success
       } catch (error) {
           res.status(500).json({ message: "Error adding something", error }); // Handle errors
       }
   });
   
   // GET route to fetch all items
   router.get("/somethings", async (req, res) => {
       try {
           const somethings = await Something.find(); // Fetch all documents in the collection
           res.status(200).json(somethings); // Respond with the fetched data
       } catch (error) {
           res.status(500).json({ message: "Error fetching somethings", error }); // Handle errors
       }
   });
   
   // GET route to fetch a specific item by title
   router.get("/something/:title", async (req, res) => {
       const { title } = req.params; // Get the `title` from the route parameters
       try {
           const something = await Something.findOne({ title }); // Find the document with the matching `title`
           if (!something) {
               return res.status(404).json({ message: "Something not found" }); // Handle case where no document is found
           }
           res.status(200).json(something); // Respond with the fetched document
       } catch (error) {
           res.status(500).json({ message: "Error finding something", error }); // Handle errors
       }
   });
   
   // DELETE route to delete an item by title
   router.delete("/something/:title", async (req, res) => {
       const { title } = req.params; // Get the `title` from the route parameters
       try {
           const deletedSomething = await Something.findOneAndDelete({ title }); // Find and delete the document
           if (!deletedSomething) {
               return res.status(404).json({ message: "Something not found to delete" }); // Handle case where no document is found
           }
           res.status(200).json({ message: "Something deleted successfully" }); // Respond with success
       } catch (error) {
           res.status(500).json({ message: "Error deleting something", error }); // Handle errors
       }
   });
   
   export default router; // Export the router for use in other files
   ```

6. Update `index.js` to include routes:
   ```javascript
   import express from 'express';
   import mongoose from 'mongoose';
   import cors from 'cors';
   import dotenv from 'dotenv';
   import somethingRouter from './routes/somethingRoute.js';

   dotenv.config();

   const app = express();
   const PORT = process.env.PORT;
   const mongoDBUrl = process.env.MONGODB_URL;

   app.use(cors());
   app.use(express.json());
   app.use("/something", somethingRouter);

   mongoose
       .connect(mongoDBUrl)
       .then(() => {
           console.log('Database Connected.');
           app.listen(PORT, () => {
               console.log(`Server is running on port ${PORT}`);
           });
       })
       .catch((error) => {
           console.log(error);
       });
   ```

---

## Step 5: Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Create a new React app using Vite:
   ```bash
   npm create vite@latest .
   ```
   - Choose `React`.
   - Choose `JavaScript`.

3. Install dependencies:
   ```bash
   npm install
   npm install axios
   ```

4. Start the React development server:
   ```bash
   npm run dev
   ```

5. Replace the content of `App.jsx` with:
   ```javascript
   import { useEffect, useState } from 'react'; // Import hooks for managing state and lifecycle
   import axios from 'axios'; // Import Axios for HTTP requests
   import './App.css'; // Import styles
   
   function App() {
       const [title, setTitle] = useState(''); // State for the title input
       const [year, setYear] = useState(''); // State for the year input
       const [somethings, setSomethings] = useState([]); // State for the list of somethings
       const [message, setMessage] = useState(''); // State for success messages
       const [error, setError] = useState(''); // State for error messages
   
       // Function to add a new item
       const handleAddSomething = async () => {
           try {
               if (!title || !year) { // Check if inputs are filled
                   setError('Please fill in both title and year');
                   return;
               }
   
               await axios.post('http://localhost:5000/something/something', { title, year }); // POST request to add item
               setMessage('Something added successfully!'); // Set success message
               setTitle(''); // Clear title input
               setYear(''); // Clear year input
           } catch (error) {
               setError('Failed to add something'); // Handle error
           }
       };
   
       // Function to fetch all items
       const handleFetchSomethings = async () => {
           try {
               const response = await axios.get('http://localhost:5000/something/somethings'); // GET request to fetch items
               setSomethings(response.data); // Update state with fetched items
               setMessage('Fetched all somethings successfully!'); // Set success message
           } catch (error) {
               setError('Failed to fetch somethings'); // Handle error
           }
       };
   
       // Fetch all items on component mount
       useEffect(() => {
           handleFetchSomethings(); // Call fetch function
       }, []);
   
       return (
           <div className="App">
               <h1>Manage Somethings</h1>
               <div>
                   <h2>Add Something</h2>
                   <input
                       type="text"
                       placeholder="Title"
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                   />
                   <input
                       type="number"
                       placeholder="Year"
                       value={year}
                       onChange={(e) => setYear(e.target.value)}
                   />
                   <button onClick={handleAddSomething}>Add</button>
               </div>

               <div>
                   <h2>Fetched Elements</h2>
                   <button onClick={handleFetchSomethings}>Fetch All</button>
                   <ul>
                       {somethings.map((something) => (
                           <li key={something._id}>
                               {something.title} ({something.year})
                               <button onClick={() => handleDeleteSomething(something.title)}>Delete</button>
                           </li>
                       ))}
                   </ul>
               </div>

               <div>
                   <h2>Fetch Something by Title</h2>
                   <input
                       type="text"
                       placeholder="Enter title"
                       onChange={(e) => setTitle(e.target.value)}
                   />
                   <button onClick={() => handleFetchSpecificSomething(title)}>Fetch</button>
               </div>

               {message && <div className="message">{message}</div>}
               {error && <div className="error">{error}</div>}
           </div>
       );
   }
   
   export default App;

   ```

---

## Step 6: Testing

You should now be able to:
1. Add new items.
2. Fetch all items.
3. Fetch specific items by title.
4. Delete items.

Navigate to [http://localhost:3000](http://localhost:3000) to test the frontend functionality.
