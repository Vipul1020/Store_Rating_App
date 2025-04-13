import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StoreOwnerRoute = ({ children }) => {
    const { isAuthenticated, isStoreOwner, loading } = useAuth();

     if (loading) {
        return <div>Loading...</div>;
    }

     if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

     if (!isStoreOwner) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children || <Outlet />;
}

export default StoreOwnerRoute;