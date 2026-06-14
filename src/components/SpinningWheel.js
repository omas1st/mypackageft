import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SpinningWheel.css';

const SEGMENT_COLORS = [
  '#2c3e50', '#34495e', '#2c3e50', '#34495e', '#2c3e50',
  '#34495e', '#2c3e50', '#34495e', '#2c3e50', '#34495e',
  '#2c3e50', '#34495e', '#2c3e50', '#34495e', '#2c3e50',
  '#34495e', '#2c3e50', '#34495e', '#2c3e50', '#34495e',
  '#2c3e50', '#34495e', '#2c3e50', '#34495e', '#2c3e50',
  '#34495e', '#2c3e50', '#34495e', '#2c3e50', '#34495e',
];

const SpinningWheel = ({ gifts, onSpinEnd, disabled, targetIndex }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const pointerRef = useRef(null);

  // Refs to avoid stale closure
  const spinningRef = useRef(spinning);
  const rotationRef = useRef(rotation);
  const giftsRef = useRef(gifts);
  const onSpinEndRef = useRef(onSpinEnd);
  const segmentAngleRef = useRef(360 / gifts.length);

  useEffect(() => { spinningRef.current = spinning; }, [spinning]);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  useEffect(() => { giftsRef.current = gifts; segmentAngleRef.current = 360 / gifts.length; }, [gifts]);
  useEffect(() => { onSpinEndRef.current = onSpinEnd; }, [onSpinEnd]);

  // Stable transition end handler
  const handleTransitionEnd = useCallback(() => {
    if (!spinningRef.current) return;
    setSpinning(false);

    const currentRotation = rotationRef.current;
    const giftList = giftsRef.current;
    const segAngle = segmentAngleRef.current;
    if (giftList.length === 0) return;

    const normalized = ((currentRotation % 360) + 360) % 360;
    const index = Math.floor(normalized / segAngle);
    const wonGift = giftList[index] || giftList[0];

    if (onSpinEndRef.current && wonGift) {
      onSpinEndRef.current(wonGift);
    }
  }, []);

  useEffect(() => {
    const pointer = pointerRef.current;
    if (!pointer) return;
    pointer.addEventListener('transitionend', handleTransitionEnd);
    return () => pointer.removeEventListener('transitionend', handleTransitionEnd);
  }, [handleTransitionEnd]);

  const spin = useCallback(() => {
    if (spinning || disabled || gifts.length === 0 || targetIndex === undefined || targetIndex === null) return;

    setSpinning(true);
    const segAngle = 360 / gifts.length;
    // Calculate target rotation: 5 full spins + land exactly in the middle of the target segment
    const targetAngle =
      rotation +
      5 * 360 +
      targetIndex * segAngle +
      segAngle / 2;

    setRotation(targetAngle);
  }, [spinning, disabled, gifts.length, targetIndex, rotation]);

  return (
    <div className="wheel-container">
      <div className="wheel" style={{ background: conicGradient() }}>
        {gifts.map((_, i) => {
          const segAngle = 360 / gifts.length;
          const angle = (i + 0.5) * segAngle;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 40 * Math.sin(rad);
          const y = 50 - 40 * Math.cos(rad);
          return (
            <span
              key={i}
              className="segment-label"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              🎁
            </span>
          );
        })}
        <div
          ref={pointerRef}
          className="pointer"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
        />
      </div>
      <button
        className="spin-btn"
        onClick={spin}
        disabled={spinning || disabled || targetIndex === undefined || targetIndex === null}
      >
        {spinning ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );

  // helper to create conic gradient
  function conicGradient() {
    const stops = gifts.map((_, i) => {
      const segAngle = 360 / gifts.length;
      const start = i * segAngle;
      const end = (i + 1) * segAngle;
      const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from 0deg, ${stops.join(', ')})`;
  }
};

export default SpinningWheel;