import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Fade';
import Copyright from '../layout/Copyright';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const theme = createTheme({
    palette: {
        primary: {
          main: '#000000',
        },
      },
    });

export default function SignUp(props) {
  const [alerts, setAlerts] = React.useState([]);

  const navigate = useNavigate();

  if (props.isAuthenticated) {
    navigate('/');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const name = firstName + ' ' + lastName

    if (email === '' || password === '' || firstName === '' || lastName === '') {
      const error = 'Fill in all the fields'
      setAlerts([...alerts, {severity: 'error', msg: error}]);
    } else {
      const options = {
        url: '/api/users',
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            email,
            password,
            name,
        }
      };

      axios(options)
        .then(res => {
          if (res.status === 200) {
            props.authenticate(res.data.token);
            setAlerts([...alerts, {severity: 'success', msg: 'Signed in!'}]);
          }
        })
        .catch(err => {
          const error = err.response.data.errors[0].msg
          setAlerts([...alerts, {severity: 'error', msg: error}]);
        });
      }
  };

  function deleteAlert(id) {
    setAlerts(prevItems => {
      return prevItems.filter((prevItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <div className='alerts'>
          {alerts.map((alert, index) => <Zoom key={index} in={true}><Alert onClose={() => deleteAlert(index)} severity={alert.severity} sx={{ mt: 2 }}>{alert.msg}</Alert></Zoom>)}
        </div>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </ThemeProvider>
  );
}