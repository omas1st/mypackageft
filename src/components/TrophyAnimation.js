import React from 'react';

const TrophyAnimation = ({ show }) => {
  if (!show) return null;
  return (
    <div className="trophy-overlay">
      <div className="trophy-animation">
        <span role="img" aria-label="trophy" style={{ fontSize: '5rem' }}>🏆</span>
        <h2>Congratulations!</h2>
      </div>
    </div>
  );
};

export default TrophyAnimation;