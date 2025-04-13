import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import Navbar from './components/Layout/Navbar';
import HomePage from './pages/Common/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ChangePasswordPage from './pages/Auth/ChangePasswordPage';
import StoresListPage from './pages/User/StoresListPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import StoreOwnerDashboardPage from './pages/StoreOwner/StoreOwnerDashboardPage';
import NotFoundPage from './pages/Common/NotFoundPage';
import UnauthorizedPage from './pages/Common/UnauthorizedPage';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import StoreOwnerRoute from './components/Auth/StoreOwnerRoute';
import PublicOnlyRoute from './components/Auth/PublicOnlyRoute';

import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/stores" element={<StoresListPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* Admin Only Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>

          {/* Store Owner Only Routes */}
          <Route path="/owner" element={<StoreOwnerRoute />}>
            <Route path="dashboard" element={<StoreOwnerDashboardPage />} />
          </Route>

          {/* Fallback Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;