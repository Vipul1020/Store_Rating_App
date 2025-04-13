import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isStoreOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} component={RouterLink} to="/">
           <StorefrontIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Store Ratings
        </Typography>
        <Box>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/signup">Sign Up</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/stores">Stores</Button>
               {isAdmin && <Button color="inherit" component={RouterLink} to="/admin/dashboard">Admin</Button>}
               {isStoreOwner && <Button color="inherit" component={RouterLink} to="/owner/dashboard">Owner</Button>}
              <Button color="inherit" component={RouterLink} to="/change-password">Change Password</Button>
              <Button color="inherit" onClick={handleLogout}>Logout ({user?.email})</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;