import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admins');
        setAdmins(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admins:', err);
        setError('Failed to fetch admins');
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      {admins.length === 0 ? (
        <p>No admins found</p>
      ) : (
        <div className="admin-list">
          {admins.map((admin) => (
            <div key={admin._id} className="admin-card">
              <img 
                src={`http://localhost:3000/${admin.photo.path}`} 
                alt={admin.name} 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h3>{admin.name}</h3>
              <p>{admin.profession}</p>
              <p>Added on: {new Date(admin.createdAt).toLocaleDateString()}</p>
              <button>Delete</button>
              <button type='submit'>Click here to book your shed</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;