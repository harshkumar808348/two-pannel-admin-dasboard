import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../src/Dashboard/Dashboard.jsx'; 
import AdminPannel from '../src/adminPannel/AdminPannel.jsx';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPannel />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
