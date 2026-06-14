import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { updateStep } from '../../services/api';
import './ConfirmDetailsPage.css';

const ConfirmDetailsPage = () => {
  const { userId, user, fetchUser, updateUser } = useUser();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    const allowedSteps = ['confirmation', 'activation', 'processing', 'verification', 'complete'];
    if (user && !allowedSteps.includes(user.step)) {
      navigate('/');
      return;
    }
    if (user && !user.userDetails) {
      setLocalLoading(true);
      fetchUser(userId)
        .then(() => setLocalLoading(false))
        .catch((err) => {
          console.error(err);
          setError('Failed to load your details.');
          setLocalLoading(false);
        });
    }
  }, [userId, user, navigate, fetchUser]);

  const handleActivate = async () => {
    try {
      await updateStep(userId, 'activation');
      updateUser({ ...user, step: 'activation' });
    } catch (err) {
      console.error('Failed to update step, proceeding anyway', err);
    }
    navigate('/activate');
  };

  if (localLoading || !user || !user.userDetails) {
    return <div className="loading-page"><p>Loading...</p></div>;
  }
  if (error) return <div className="error-page"><p>{error}</p></div>;

  const { name, address, country, phone, email, image } = user.userDetails;
  const gift = user.giftWon;

  return (
    <div className="confirm-page">
      <h1>Congratulations, {name}!</h1>
      <p>You have won the following gift:</p>
      {gift && (
        <div className="gift-summary">
          <img src={gift.image} alt={gift.name} />
          <h3>{gift.name}</h3>
        </div>
      )}
      <div className="user-info">
        <p><strong>Address:</strong> {address}, {country}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Email:</strong> {email}</p>
        {image && <img src={image} alt="User" style={{ width: '100px' }} />}
      </div>
      <p>This gift will be transported to your home address. Kindly activate the gift to confirm and proceed with delivery.</p>
      <button className="activate-btn" onClick={handleActivate}>
        Activate Gift
      </button>
    </div>
  );
};

export default ConfirmDetailsPage;