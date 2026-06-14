import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { startSession } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveUserId, updateUser } = useUser();

  const handleSelect = (num) => {
    setSelectedNumber(num);
  };

  const handleStart = async () => {
    if (!selectedNumber) return alert('Please select a number.');
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
      <h1>Pick a Lucky Number (1-30)</h1>
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
      <button className="start-btn" onClick={handleStart} disabled={!selectedNumber || loading}>
        {loading ? 'Starting...' : 'Start Game'}
      </button>
    </div>
  );
};

export default HomePage;