import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Appbar(props) {

  const authLinks = [
    {text: 'Dashboard', href: '/dashboard', name: 'dashboard'},
    {text: 'Create Poll', href: '/dashboard/create', name: 'createPoll'},
    {text: 'Logout', href: '/', name: 'logout'}
  ];

  const guestLinks = [
    {text: 'Sign In', href: '/signin'},
    {text: 'Sign Up', href: '/signup'}
  ];

  function handleClick(event) {
    if (event.target.name === 'logout') {
      props.logout();
    }
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <a href="/"> Thumbnail Polls </a>
                </Typography>

                {props.render && props.isAuthenticated && authLinks.map((link, index) => <a key={index} href={link.href}><Button onClick={handleClick} name={link.name} color="inherit">{link.text}</Button></a>)}
                {props.render && !props.isAuthenticated && guestLinks.map((link, index) => <a key={index} href={link.href} onClick={handleClick}><Button color="inherit">{link.text}</Button></a>)}
                
            </Toolbar>
        </AppBar>
    </ThemeProvider>
  );
}
