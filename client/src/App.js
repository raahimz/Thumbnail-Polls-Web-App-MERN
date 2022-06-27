import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import Appbar from './components/layout/Appbar';
import Dashboard from './components/dashboard/Dashboard';
import CreatePoll from './components/poll/CreatePoll';
import Poll from './components/poll/Poll';
import './App.css';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [render, setRender] = useState(false);

  function authenticate(token) {
    setIsAuthenticated(true);
    window.localStorage.setItem('token', token);
  }

  function logout() {
    setIsAuthenticated(false);
    window.localStorage.removeItem('token');
    console.log("logged out!")
  }

  useEffect(() => {
    const token = window.localStorage.getItem('token')

    const options = {
      url: '/api/auth',
      method: 'GET', 
      headers: {
          'x-auth-token': token,
      },
    };

    if (!isAuthenticated) {
      axios(options)
        .then(res => {
          if (res.status === 200) {
            setIsAuthenticated(true);
            setUser(res.data);
          }
          setRender(true);
        })
        .catch(err => {setRender(true);});
    }
    
 },[]);

  return (
    <Fragment>
      <Appbar isAuthenticated={isAuthenticated} render={render} logout={logout} />
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Landing isAuthenticated={isAuthenticated} render={render} />}
          />
          <Route
            path="/signup"
            element={<Signup authenticate={authenticate} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/signin"
            element={<Signin authenticate={authenticate} isAuthenticated={isAuthenticated} />}
          />
          { render && <Route
            path="/dashboard"
            element={<Dashboard isAuthenticated={isAuthenticated} />}
          /> }
          { render && <Route
            path="/dashboard/create"
            element={<CreatePoll isAuthenticated={isAuthenticated} />}
          /> }
          { render && <Route
            path="/polls/:id"
            element={<Poll isAuthenticated={isAuthenticated} userID={user && user._id} />}
          /> }
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
