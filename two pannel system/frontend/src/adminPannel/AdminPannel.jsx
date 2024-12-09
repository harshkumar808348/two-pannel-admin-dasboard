import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    photo: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      photo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('profession', formData.profession);
      formDataToSend.append('photo', formData.photo);

      const response = await axios.post('http://localhost:3000/adminpanel', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Admin created successfully!');
      // Reset form after successful submission
      setFormData({
        name: '',
        profession: '',
        photo: null
      });
      // Clear file input
      e.target.reset();
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          required
        />
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleInputChange}
          placeholder="Enter your profession"
          required
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminPanel;