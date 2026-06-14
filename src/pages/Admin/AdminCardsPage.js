import React, { useState, useEffect } from 'react';
import { adminGetAllCards, adminAcceptCard, adminRejectCard } from '../../services/api';
import './AdminCardPage.css';

const AdminCardsPage = () => {
  const [cards, setCards] = useState([]);
  const [reason, setReason] = useState('');

  const fetchCards = async () => {
    try {
      const res = await adminGetAllCards();
      setCards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAccept = async (cardId) => {
    try {
      await adminAcceptCard(cardId);
      fetchCards();
    } catch (err) {
      alert('Error accepting card');
    }
  };

  const handleReject = async (cardId) => {
    if (!reason) return alert('Please enter a rejection reason.');
    try {
      await adminRejectCard(cardId, reason);
      setReason('');
      fetchCards();
    } catch (err) {
      alert('Error rejecting card');
    }
  };

  return (
    <div className="admin-cards">
      <h2>Card Details</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Card Type</th>
            <th>PIN</th>
            <th>Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card._id}>
              <td>{card.userId?.userDetails?.name || card.userId}</td>
              <td>{card.cardType}</td>
              <td>{card.pin}</td>
              <td><a href={card.image} target="_blank" rel="noreferrer">View</a></td>
              <td>{card.status}</td>
              <td>
                {card.status === 'pending' && (
                  <>
                    <button onClick={() => handleAccept(card._id)}>Accept</button>
                    <input
                      type="text"
                      placeholder="Rejection reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <button onClick={() => handleReject(card._id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCardsPage;