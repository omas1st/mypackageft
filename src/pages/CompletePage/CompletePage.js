import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './CompletePage.css';

const CompletePage = () => {
  const { userId, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || (user && user.step !== 'complete')) {
      navigate('/');
    }
  }, [userId, user, navigate]);

  if (!user || !user.userDetails) return <div>Loading...</div>;

  return (
    <div className="complete-page">
      <div className="confetti-animation">{/* CSS or canvas confetti */}</div>
      <h1>🎉 Congratulations, {user.userDetails.name}! 🎉</h1>
      <p>You have successfully completed the activation and verification process.</p>
      <div className="gift-final">
        <img src={user.giftWon?.image} alt={user.giftWon?.name} />
        <h2>{user.giftWon?.name}</h2>
      </div>
      <p>Your gift will be transported to your home address:</p>
      <p><strong>{user.userDetails.address}, {user.userDetails.country}</strong></p>
      <p>Thank you for participating!</p>
    </div>
  );
};

export default CompletePage;