import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { submitUserDetails } from '../../services/api';
import './UserDetailsPage.css';

const UserDetailsPage = () => {
  const { userId, user, updateUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    country: '',
    phone: '',
    email: '',
    userImage: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    // Redirect only if the user hasn't reached the 'details' step yet
    if (user && !['details', 'confirmation', 'activation', 'processing', 'verification', 'complete'].includes(user.step)) {
      navigate('/');
    }
  }, [userId, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, userImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.country || !form.phone || !form.email || !form.userImage) {
      alert('All fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitUserDetails(userId, form);
      // Update context with full user data from backend
      updateUser({ ...user, ...res.data });
      navigate('/confirm');
    } catch (err) {
      alert('Submission failed. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="details-page">
      <h1>Enter Your Details</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Home Address" value={form.address} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Gmail" value={form.email} onChange={handleChange} required />
        <label>
          Upload Your Image:
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default UserDetailsPage;