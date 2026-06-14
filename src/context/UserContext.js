import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProgress } from '../services/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [user, setUser] = useState(null);       // full user object from backend
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (id) => {
    try {
      const res = await getUserProgress(id);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user progress', err);
      // if user not found, clear
      localStorage.removeItem('userId');
      setUserId(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    } else {
      setLoading(false);
    }
  }, [userId, fetchUser]);

  const saveUserId = (id) => {
    localStorage.setItem('userId', id);
    setUserId(id);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ userId, user, loading, saveUserId, updateUser, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};