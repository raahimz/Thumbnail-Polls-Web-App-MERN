import React, { useEffect, useState } from 'react';

import { Typography, Stack, Button, Grow, Fade, Slide, Zoom } from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const myTheme = createTheme({
palette: {
    primary: {
      main: '#000000',
    },
  },
});

const Landing = (props) => {
    const [showHeading, setShowHeading] = useState(false);
    const [showSubHeading1, setShowSubHeading1] = useState(false);
    const [showSubHeading2, setShowSubHeading2] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [showButton1, setShowButton1] = useState(false);
    const [showButton2, setShowButton2] = useState(false);


    useEffect(() => {
        // trigger animations
        setTimeout(function() { setShowHeading(true) }, 300);
        setTimeout(function() { setShowSubHeading1(true) }, 600);
        setTimeout(function() { setShowSubHeading2(true) }, 900);
        setTimeout(function() { setShowDesc(true) }, 1400 );
        setTimeout(function() { setShowButton1(true) }, 2000);
        setTimeout(function() { setShowButton2(true) }, 1900);

        // set body background-color and background-image
        document.body.style.backgroundImage = 'url("https://transparenttextures.com/patterns/graphy.png")';
        document.body.style.backgroundColor = '#fffff';
    });

    return (
        <section className='landing'>
            <Fade in={showHeading}>
            <Typography variant='h2' style={{fontWeight: '900'}}>
                Thumbnail Polls
            </Typography>
            </Fade>

            <div style={{marginTop: '75px'}}>
                <Slide direction='up' in={showSubHeading1}>
                <Typography variant='h3' style={{fontWeight: '500'}}>
                    Can't decide which thumbnail is more appealing?
                </Typography>
                </Slide>
                <Slide direction='up' in={showSubHeading2}>
                <Typography variant='h3' style={{fontWeight: '100'}}>
                    Let your followers decide!
                </Typography>
                </Slide>
            </div>

            <Zoom in={showDesc}>
            <div className='description'>
                <Typography variant='h4' style={{fontWeight: '200'}}>
                    Create a poll with your thumnail variations, share it with your followers, get their feedback.
                </Typography>
            </div>
            </Zoom>

            <ThemeProvider theme={myTheme}>
                <div style={{marginTop: '75px'}}>
                    <Stack style={{visibility: (props.render && !props.isAuthenticated) ? 'visible' : 'hidden'}} direction='row' justifyContent='center' alignItems='center' spacing={1}>
                        <Grow in={showButton1}>
                        <a href="/signin">
                            <Button style={{padding: '10px 50px 10px 50px'}} variant='outlined' color='primary'>Sign In</Button>
                        </a>
                        </Grow>
                        <Grow in={showButton2}>
                        <a href='/signup'>
                            <Button style={{padding: '10px 50px 10px 50px'}} variant='contained' color='primary'>Sign Up</Button>
                        </a>
                        </Grow>
                    </Stack>
                    <Stack style={{visibility: (props.render && props.isAuthenticated) ? 'visible' : 'hidden'}} direction='row' justifyContent='center' alignItems='center' spacing={1}>
                        <Grow in={showButton1}>
                        <a href="/dashboard">
                            <Button style={{padding: '10px 50px 10px 50px'}} variant='contained' color='primary'>Go to Dashboard</Button>
                        </a>
                        </Grow>
                    </Stack>
                </div>
            </ThemeProvider>
        </section>
    )
}

export default Landing;