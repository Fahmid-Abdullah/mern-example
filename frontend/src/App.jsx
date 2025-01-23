import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [somethings, setSomethings] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddSomething = async () => {
    try {
      if (!title || !year) {
        setError('Please fill in both title and year');
        return;
      }

      await axios.post('http://localhost:5000/something/something', {
        title,
        year,
      });

      setMessage('Something added successfully!');
      setTitle('');
      setYear('');
      // Optionally, call fetchSomethings to refresh after adding something
    } catch (error) {
      setError('Failed to add something');
    }
  };

  const handleFetchSomethings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/something/somethings');
      setSomethings(response.data);
      setMessage('Fetched all somethings successfully!');
    } catch (error) {
      setError('Failed to fetch somethings');
    }
  };

  useEffect(() => {
    handleFetchSomethings();
  }, [])

  const handleDeleteSomething = async (titleToDelete) => {
    try {
      const response = await axios.delete(`http://localhost:5000/something/something/${titleToDelete}`);

      if (response.status === 200) {
        setMessage('Something deleted successfully!');
        // Optionally, call fetchSomethings to refresh after deletion
      }
    } catch (error) {
      setError('Failed to delete something');
    }
  };

  const handleFetchSpecificSomething = async (titleToFetch) => {
    try {
      const response = await axios.get(`http://localhost:5000/something/something/${titleToFetch}`);

      if (response.status === 200) {
        setMessage('Fetched something successfully!');
        setSomethings([response.data]); // Display only the specific item
      } else {
        setMessage('Something not found');
      }
    } catch (error) {
      setError('Failed to fetch specific something');
    }
  };

  return (
    <div className="App">
      <h1>Manage Somethings</h1>

      {/* Add Something Form */}
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

      {/* Fetch All Somethings */}
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

      {/* Fetch Specific Something */}
      <div>
        <h2>Fetch Something by Title</h2>
        <input
          type="text"
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={() => handleFetchSpecificSomething(title)}>Fetch</button>
      </div>

      {/* Message and Error Handling */}
      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
