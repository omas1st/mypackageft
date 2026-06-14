import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { startSession } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveUserId, updateUser } = useUser();

  const handleSelect = (num) => {
    setSelectedNumber(num);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNumber(null);
  };

  const handleStart = async () => {
    if (!selectedNumber) return;
    setLoading(true);
    try {
      const res = await startSession(selectedNumber);
      const userData = res.data;
      saveUserId(userData.userId);
      updateUser(userData);
      navigate('/spin');
    } catch (err) {
      alert('Error starting session. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1 className="main-title">GameSpin</h1>
      <h2 className="sub-title">Pick a Lucky Number (1-30)</h2>

      <div className="number-grid">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`number-btn ${selectedNumber === num ? 'selected' : ''}`}
            onClick={() => handleSelect(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              You selected number{' '}
              <span className="selected-number">{selectedNumber}</span>
            </h3>
            <button
              className="start-btn"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
            <button className="close-modal-btn" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;