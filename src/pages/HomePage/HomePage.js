import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { startSession } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveUserId, updateUser } = useUser();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSelect = (num) => {
    setSelectedNumber(num);
    setEmail('');
    setEmailError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNumber(null);
    setEmail('');
    setEmailError('');
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !emailRegex.test(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const canStart = selectedNumber && email && emailRegex.test(email) && !loading;

  const handleStart = async () => {
    if (!canStart) return;
    setLoading(true);
    try {
      const res = await startSession(selectedNumber, email);
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
      <div className="header-section">
        <h1 className="main-title">GiftSpin</h1>
        <h2 className="sub-title">Pick a Lucky Number (1-30)</h2>
      </div>

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
            <div className="email-input-group">
              <input
                type="email"
                placeholder="Enter your email to secure your spin"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? 'input-error' : ''}
                required
                autoFocus
              />
              {emailError && <small className="error-text">{emailError}</small>}
            </div>
            <button
              className="start-btn"
              onClick={handleStart}
              disabled={!canStart}
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
            <button className="close-modal-btn" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Optional: Returning user link */}
      <div className="returning-user">
        <p>
          Already started?{' '}
          <button
            className="resume-btn"
            onClick={() => navigate('/resume')}
          >
            Resume your spin
          </button>
        </p>
      </div>
    </div>
  );
};

export default HomePage;