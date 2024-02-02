import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: `${theme.spacing(1)} 0`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate('/signup');
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/auth/login', {
        email,
        password,
      });
  
      const { token, role, userId } = response.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', userId);
  
      // Perform role-based navigation
      if (role === 'admin') {
        // Redirect to the admin page
        navigate('/tablePage');
      } else if (role === 'user') {
        // Redirect to the user page
        navigate('/userForm');
      } else {
        // Handle other roles or unknown roles
        console.error('Unknown role:', role);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

//   const handleLogin = async(e) => {
//     e.preventDefault();
//     await axios.post('http://127.0.0.1:3000/api/auth/login',{email , password})
//     .then((res)=> {
//         localStorage.setItem('accessToken', res.data.token)
//         navigate('/TablePage')
//     })
//     .catch((err)=> console.log(err))
//     console.log('Login clicked');
//   };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography variant="h5">Login</Typography>
        <StyledForm >
          <StyledTextField
            variant="outlined"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StyledTextField
            variant="outlined"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledButton type="submit" fullWidth variant="contained" color="primary" onClick={handleLogin}>
            Login
          </StyledButton>
          <StyledButton type="submit" fullWidth variant="contained" color="primary" onClick={handleSignUp}>
            Sign Up
          </StyledButton>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default Login;
