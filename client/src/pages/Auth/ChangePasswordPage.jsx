import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';

function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
   const [validationErrors, setValidationErrors] = useState([]);
  const { changePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors([]);

    try {
      const response = await changePassword(newPassword);
      setSuccess(response.message || 'Password changed successfully!');
      setNewPassword(''); // Clear field on success
    } catch (err) {
       const errorMsg = err.message || 'Failed to change password.';
       setError(errorMsg);
       if (err.errors) {
           setValidationErrors(err.errors);
       }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        {error && !validationErrors.length && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
         {validationErrors.length > 0 && (
             <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                <ul>
                    {validationErrors.map((err, index) => <li key={index}>{err.msg}</li>)}
                </ul>
            </Alert>
        )}
        {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password (8-16 chars, 1 Upper, 1 Special)"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={validationErrors.some(err => err.path === 'newPassword')}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ChangePasswordPage;