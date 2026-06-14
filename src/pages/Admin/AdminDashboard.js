import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <nav>
        <Link to="/admin/users">User Details</Link>
        <Link to="/admin/cards">Card Details</Link>
        <Link to="/admin/gifts">Edit Gifts</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;