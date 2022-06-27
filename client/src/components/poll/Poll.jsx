import axios from 'axios';
import { useEffect, useState } from 'react'
import { Typography, Stack, Button, Alert, Zoom, Tooltip, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import Copyright from '../layout/Copyright';
import Delete from '@mui/icons-material/Delete';
import PollIcon from '@mui/icons-material/Poll';

const myTheme = createTheme({
palette: {
    primary: {
      main: '#000000',
    },
  },
});

const myThemeSettings = createTheme({
    palette: {
        primary: {
          main: '#FFFFFF',
        },
    },
});
    

const Poll = (props) => {
    const [poll, setPoll] = useState({});
    const [render, setRender] = useState(false);
    const [width, setWidth] = useState();
    const [optionChosen, setOptionChosen] = useState();
    const [alerts, setAlerts] = React.useState([]);
    const [votes, setVotes] = useState({option1: 10, option2: 8});
    const [openPollResults, setOpenPollResults] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [noPostFound, setNoPostFound] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [deleteForm, setDeleteForm] = useState('');

    async function getPoll() {
        const id = (window.location.pathname).slice(7);

        const options = {
            url: '/api/posts/' + id,
            method: 'GET'
        };

        try {
            const res = await axios(options)
            setPoll(res.data);
            setVotes({option1: res.data.option1.votes.length, option2: res.data.option2.votes.length})
            setRender(true);
        } catch (err) {
            if (err.response.status) {
                setRender(false);
                setNoPostFound(true);
            }
            console.error(err);
        }
    }

    async function deletePoll() {
        const id = (window.location.pathname).slice(7);
        const token = window.localStorage.getItem('token');

        const options = {
            url: '/api/posts',
            method: 'DELETE', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'x-auth-token': token
            },
            data: {
                id
            }
        };

        try {
            const response = await axios(options)
            if (response.status === 200) {
                alert('Poll deleted, redirecting you to dashboard...')
                setRender(false);
                window.location.href = '/dashboard'
            }
        } catch (err) {
            if (err.response.status) {
                setAlerts([...alerts, {severity: 'error', msg: 'Server error'}]);
            }
            console.error(err);
        }
    }

    useEffect(() => {
        getPoll();

        setWidth(window.innerWidth)

        window.addEventListener('resize', () => {setWidth(window.innerWidth)})

    }, [])

    function handleClick(event) {
        setOptionChosen(event.target.name);
    }

    function submitVote() {
        const id = (window.location.pathname).slice(7);

        if (props.userID === poll.userID) {
            return setAlerts([...alerts, {severity: 'warning', msg: "You are the author, you can't vote silly!"}]);
        }

        const token = window.localStorage.getItem('token');

        const options = {
            url: '/api/posts',
            method: 'PUT', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'x-auth-token': token
            },
            data: {
                id,
                option: optionChosen
            }
        };
    
        axios(options)
            .then(res => {
                if (res.status === 200) {
                    setAlerts([...alerts, {severity: 'success', msg: 'Voted Successfuly!'}]);
                    setHasVoted(true);
                } 
            })
            .catch(err => {
                if (!err.response.data.msg) {
                    setAlerts([...alerts, {severity: 'error', msg: `Error, ${err.response.data}`}]);
                } else {
                    setAlerts([...alerts, {severity: 'error', msg: `Error, ${err.response.data.msg}`}]);
                }
            });
    }

    function deleteAlert(id) {
        setAlerts(prevItems => {
            return prevItems.filter((prevItem, index) => {
            return index !== id;
            });
        });
    }

    function handleOpenPollResultsClick() {
        const id = (window.location.pathname).slice(7);
        getPoll();
        setOpenPollResults(true);
    }
    
    return (
        <div className='poll'>
            <div className='create-poll-heading'>
                <Typography variant='h3' style={{fontWeight: 'bolder'}}>{!noPostFound ? "Which thumbnail is better?" : "Oops! Wrong page, no poll found"}</Typography>
            </div>

            <div className='poll-description'>
                { render &&  <Typography variant='h6' style={{fontWeight: 'normal'}}>Title: <b>{poll.title}</b></Typography> }
                { render &&  <Typography variant='h6' style={{fontWeight: 'normal'}}>Description: <b>{poll.description}</b></Typography> }
                { render &&  <Typography variant='h6' style={{fontWeight: 'normal'}}>Author: <b>{poll.userName}</b> {(props.isAuthenticated && props.userID === poll.userID) && '(you)'}</Typography> }
                <ThemeProvider theme={myThemeSettings}>
                    { (props.isAuthenticated && props.userID === poll.userID) && <Button onClick={() => {handleOpenPollResultsClick(true)}} fullWidth style={{marginTop: '10px'}} variant='outlined' startIcon={<PollIcon/>}>Poll Results</Button>}
                    { (props.isAuthenticated && props.userID === poll.userID) && <Button onClick={() => setOpenSettings(true)} fullWidth style={{marginTop: '10px'}} variant='outlined' startIcon={<Delete/>}>Delete Poll</Button>}
                </ThemeProvider>
            </div>

            <ThemeProvider theme={myTheme}>
                <Dialog fullWidth={true} onClose={() => {setOpenPollResults(false)}} open={openPollResults}>
                    <DialogTitle>Poll Results</DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <Stack direction='row'>
                                <Stack direction='row'>
                                    <div style={{marginLeft: '10px', marginTop: '4px', width: '12px', height: '12px', backgroundColor: 'rgb(0, 162, 0)'}}></div>
                                    <Typography variant="subtitle2" style={{marginLeft: '5px'}}>Option #1</Typography>
                                </Stack>
                                <Stack direction='row'>
                                    <div style={{marginLeft: '10px', marginTop: '4px', width: '12px', height: '12px', backgroundColor: 'rgb(171, 2, 2)'}}></div>
                                    <Typography variant="subtitle2" style={{marginLeft: '5px'}}>Option #2</Typography>
                                </Stack>
                            </Stack>
                            <Tooltip title={`Votes Ratio`}>
                                <div className='votes-bar' style={{color: 'white'}}>
                                    <div className='option1-bar' style={{width: `${(votes.option1/(votes.option1+votes.option2))*100}%`}}>
                                        <Typography>{Math.floor((votes.option1/(votes.option1+votes.option2))*100)}%</Typography>
                                    </div>
                                    <div className='option2-bar' style={{width: `${(votes.option2/(votes.option1+votes.option2))*100}%`}}>
                                        <Typography>{Math.floor((votes.option2/(votes.option1+votes.option2))*100)}%</Typography>
                                    </div>
                                </div>
                            </Tooltip>
                        </div>

                        <Stack direction='row' spacing={10} style={{marginTop: '15px'}}>
                            <Typography variant="subtitle1" >
                                Option #1 votes: <span style={{color: 'rgb(0, 162, 0)'}}><b><u>{votes.option1}</u></b></span>
                            </Typography >
                            <Typography variant="subtitle1">
                                Option #2 votes: <span style={{color: 'rgb(171, 2, 2)'}}><b><u>{votes.option2}</u></b></span>
                            </Typography>
                            <Typography variant="subtitle1">
                                Total votes: <b><u>{votes.option2 + votes.option1}</u></b>
                            </Typography>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {setOpenPollResults(false)}}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>

            <ThemeProvider theme={myTheme}>
                <Dialog fullWidth={true} onClose={() => {setOpenSettings(false)}} open={openSettings}>
                    <DialogTitle>Delete Poll</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText>
                            Deleting this poll is a permanent action, which is irreversible. Just to be sure, you will no longer be able to view the poll results.
                        </DialogContentText>
                        <div style={{backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', textAlign: 'center', padding: '2px', boxShadow: '0px 0px 2px 0.5px rgba(0,0,0,0.3)', marginTop: '10px'}}>
                            <Typography variant='h5' style={{fontWeight: '500', letterSpacing: '1px'}}>{poll.title}</Typography>
                        </div>
                        <TextField onChange={(e) => {setDeleteForm(e.target.value)}} value={deleteForm} margin='dense' autoFocus label="Type in the title" fullWidth variant="standard" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {deletePoll()}} disabled={deleteForm === poll.title ? false : true} variant='contained' color='error'>
                            Delete
                        </Button>
                        <Button onClick={() => {setOpenSettings(false)}}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>

            <Typography style={{marginTop: '15px', opacity: '0.3'}} variant='h6'>*Select one of the following thumbnails</Typography>

            <Stack className="images-container" direction={ width > 1400 ? 'row' : 'column' } spacing={2}>
                <div className='img-overlay'>
                    { render && <img className='img' onClick={handleClick} name="option1" style={{objectFit: 'cover', border: optionChosen === "option1" && '10px solid #2eff8f'}} height="360" width="640" src={poll.option1.url} /> }
                </div>
                <div className='img-overlay'>
                    { render && <img className='img' onClick={handleClick} name="option2" style={{objectFit: 'cover', border: optionChosen === "option2" && '10px solid #2eff8f'}} height="360" width="640" src={poll.option2.url} /> }
                </div>
            </Stack>

            <ThemeProvider theme={myTheme}>
                { !optionChosen && <Button disabled style={{marginTop: '50px', padding: '15px', width: '200px'}}  variant="contained" size='large'>Vote</Button> }
                { optionChosen && <Button onClick={() => submitVote()} style={{marginTop: '50px', padding: '15px', width: '200px'}}  variant="contained" size='large'>Vote</Button> }
            </ThemeProvider>

            {hasVoted && <ThemeProvider theme={myTheme}>
                <Zoom in={true}>
                    <div className='post-vote-container'>
                        <Typography variant='h4'>Thank you for voting 😄</Typography>
                        <Button onClick={() => {handleOpenPollResultsClick(true)}} fullWidth style={{marginTop: '10px'}} variant='outlined' startIcon={<PollIcon/>}>Poll Results</Button>
                    </div>
                </Zoom>
            </ThemeProvider> }
            
            <div className='alerts' style={{width: '40%', margin: '10px auto 0px auto'}}>
                {alerts.map((alert, index) => <Zoom key={index} in={true}><Alert onClose={() => deleteAlert(index)} severity={alert.severity} sx={{ mt: 2 }}>{alert.msg}</Alert></Zoom>)}
            </div>
            <Copyright style={{marginTop: '20px'}}></Copyright>
        </div>
    )
}

export default Poll;