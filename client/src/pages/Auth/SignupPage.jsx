import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Box, TextField, Button, Typography, Alert, Link } from '@mui/material';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);
    try {
      await signup(name, email, password, address);
      navigate('/stores'); // Redirect after successful signup
    } catch (err) {
       const errorMsg = err.message || 'Signup failed.';
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
          Sign Up
        </Typography>
        {error && !validationErrors.length && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        {validationErrors.length > 0 && (
             <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                <ul>
                    {validationErrors.map((err, index) => <li key={index}>{err.msg}</li>)}
                </ul>
            </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
           <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name (7-30 chars)"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={validationErrors.some(err => err.path === 'name')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={validationErrors.some(err => err.path === 'email')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password (8-16 chars, 1 Upper, 1 Special)"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             error={validationErrors.some(err => err.path === 'password')}
          />
           <TextField
            margin="normal"
            fullWidth
            name="address"
            label="Address (Optional, max 400 chars)"
            id="address"
            autoComplete="street-address"
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={validationErrors.some(err => err.path === 'address')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
           <Link component={RouterLink} to="/login" variant="body2">
            {"Already have an account? Sign In"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default SignupPage;