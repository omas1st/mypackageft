import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import HomePage from './pages/HomePage/HomePage';
import SpinPage from './pages/SpinPage/SpinPage';
import UserDetailsPage from './pages/UserDetailsPage/UserDetailsPage';
import ConfirmDetailsPage from './pages/ConfirmDetailsPage/ConfirmDetailsPage';
import ActivatePage from './pages/ActivatePage/ActivatePage';
import ProcessingPage from './pages/ProcessingPage/ProcessingPage';
import VerificationPage from './pages/VerificationPage/VerificationPage';
import CompletePage from './pages/CompletePage/CompletePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminCardsPage from './pages/Admin/AdminCardsPage';
import AdminEditGiftsPage from './pages/Admin/AdminEditGiftsPage';
import './App.css';

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Routes>
          {/* User routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/spin" element={<SpinPage />} />
          <Route path="/details" element={<UserDetailsPage />} />
          <Route path="/confirm" element={<ConfirmDetailsPage />} />
          <Route path="/activate" element={<ActivatePage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/complete" element={<CompletePage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/cards" element={<AdminCardsPage />} />
          <Route path="/admin/gifts" element={<AdminEditGiftsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;