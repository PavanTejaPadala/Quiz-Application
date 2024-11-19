import { AppBar, Button, Container, Typography, Toolbar, Box } from '@mui/material';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useStateContext from '../Hooks/useStateContext';

export default function Layout() {
  const { resetContext } = useStateContext();
  const navigate = useNavigate();

  const logout = () => {
    resetContext();
    navigate('/');
  };

  return (
    <>
      <AppBar position='sticky' sx={{ backgroundColor: 'rgb(58, 141, 255)' }}>
        <Toolbar sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
   
          {/* <Box
            component="img"
            src="cybage.png"
            alt="Logo"
            sx={{ height: 50, width: 50 }}
          /> */}

          <Typography 
            variant='h4' 
            sx={{ flexGrow: 1, color: 'white', textAlign: 'center' }}>
            Quiz App
          </Typography>

          <Button 
            onClick={logout} 
            sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.2)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.4)' } }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
