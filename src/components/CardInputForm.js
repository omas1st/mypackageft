import React, { useState } from 'react';

const CARD_TYPES = ['Apple Gift Card', 'Steam Gift Card', 'Razer Gift Card', 'Sephora Gift Card'];

const CardInputForm = ({ type, onSubmit, disabled }) => {
  const [cardType, setCardType] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [cardImage, setCardImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardType || !amount || !pin || !cardImage) {
      alert('Please fill all fields and upload card image.');
      return;
    }
    onSubmit({
      type,
      cardType,
      amount,
      pin,
      cardImage,
    });
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <select value={cardType} onChange={(e) => setCardType(e.target.value)} required disabled={disabled}>
        <option value="">Select Gift Card</option>
        {CARD_TYPES.map((ct) => (
          <option key={ct} value={ct}>{ct}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Amount purchased ($)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="Gift Card PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        required
        disabled={disabled}
      />
      <label>
        Upload back of card / PIN image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCardImage(e.target.files[0])}
          required
          disabled={disabled}
        />
      </label>
      <button type="submit" disabled={disabled}>
        {disabled ? 'Waiting...' : 'Proceed'}
      </button>
    </form>
  );
};

export default CardInputForm;