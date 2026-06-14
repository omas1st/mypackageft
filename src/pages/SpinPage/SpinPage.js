import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { spinWheel, getGifts } from '../../services/api';
import SpinningWheel from '../../components/SpinningWheel';
import TrophyAnimation from '../../components/TrophyAnimation';
import './SpinPage.css';

const SpinPage = () => {
  const { userId, user, updateUser } = useUser();
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [targetIndex, setTargetIndex] = useState(undefined);
  const [prize, setPrize] = useState(null);
  const [showTrophy, setShowTrophy] = useState(false);
  const [loading, setLoading] = useState(true);
  const wheelRef = useRef();

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    const allowedSteps = ['spin', 'details', 'confirmation', 'activation', 'processing', 'verification', 'complete'];
    if (user && !allowedSteps.includes(user.step)) {
      navigate('/');
    }
  }, [userId, user, navigate]);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await getGifts();
        setGifts(res.data);
      } catch (err) {
        console.error('Failed to fetch gifts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, [userId]);

  useEffect(() => {
    if (showTrophy) {
      const timer = setTimeout(() => setShowTrophy(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTrophy]);

  const handleStartSpin = async () => {
    if (!userId || gifts.length === 0) return;
    try {
      const res = await spinWheel(userId);
      const wonGift = res.data.gift;
      const idx = gifts.findIndex(g => g._id === wonGift._id);
      if (idx === -1) throw new Error('Gift not found in wheel');
      setTargetIndex(idx);
    } catch (err) {
      console.error('Spin fetch error', err);
      alert('Could not start the spin. Please try again.');
    }
  };

  const handleSpinEnd = (wonGift) => {
    setPrize(wonGift);
    setShowTrophy(true);
    updateUser({ ...user, step: 'details' });
  };

  const handleGetGift = () => {
    navigate('/details');
  };

  if (loading) return <div>Loading...</div>;

  // Determine if we're in the "start button" state
  const isStartState = !prize && (targetIndex === undefined || targetIndex === null);

  return (
    <div className={`spin-page ${isStartState ? 'with-bg' : ''}`}>
      <h1>Spin to Win!</h1>

      {!prize ? (
        <>
          {targetIndex === undefined || targetIndex === null ? (
            <button
              className="spin-btn"
              onClick={handleStartSpin}
              disabled={gifts.length === 0}
            >
              Start Spin
            </button>
          ) : (
            <SpinningWheel
              ref={wheelRef}
              gifts={gifts}
              targetIndex={targetIndex}
              onSpinEnd={handleSpinEnd}
              disabled={false}
            />
          )}
        </>
      ) : (
        <div className="spin-result">
          <TrophyAnimation show={showTrophy} />
          <h2>You won: {prize.name}</h2>
          <img src={prize.image} alt={prize.name} style={{ width: '200px' }} />
          <button className="get-gift-btn" onClick={handleGetGift}>
            Get Gift
          </button>
        </div>
      )}
    </div>
  );
};

export default SpinPage;