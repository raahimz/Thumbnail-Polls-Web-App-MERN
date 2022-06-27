import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Zoom from '@mui/material/Zoom';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Copyright from '../layout/Copyright';
import { useNavigate } from 'react-router-dom'


const theme = createTheme({
    palette: {
        primary: {
          main: '#000000',
        },
      },
    });

export default function Login(props) {
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

    if (email === '' || password === '') {
      const error = 'Fill in all the fields'
      setAlerts([...alerts, {severity: 'error', msg: error}]);
    } else {
      const options = {
        url: '/api/auth',
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            email,
            password
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
          <Avatar sx={{ m: 1, bgColor: theme.primary }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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