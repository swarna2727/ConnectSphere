import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

// Covers: Venue Catalogue + Venue Search and Filtering (basic version).
export default function VenueList() {
  const { token } = useAuth();
  const [venues, setVenues] = useState([]);
  const [minCapacity, setMinCapacity] = useState('');
  const [error, setError] = useState('');

  function load() {
    const path = minCapacity ? `/venues/search?minCapacity=${minCapacity}` : '/venues';
    api.get(path, token).then((data) => setVenues(data.venues)).catch((err) => setError(err.message));
  }

  useEffect(load, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h1>Venues</h1>
      <div className="card">
        <label>Minimum capacity
          <input type="number" min="0" value={minCapacity} onChange={(e) => setMinCapacity(e.target.value)} style={{ maxWidth: 150 }} />
        </label>
        <button onClick={load} style={{ marginTop: '0.5rem', maxWidth: 150 }}>Search</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {venues.map((v) => (
        <div className="card" key={v.id}>
          <h3><Link to={`/venues/${v.id}`}>{v.name}</Link></h3>
          <p>{v.location}</p>
          <p>Capacity: {v.capacity}</p>
        </div>
      ))}

      <div className="todo-note">
        TODO: full filter set (date/time availability, accessibility, layout,
        facilities) per "Venue Search and Filtering" — see venueModel.search().
      </div>
    </div>
  );
}
