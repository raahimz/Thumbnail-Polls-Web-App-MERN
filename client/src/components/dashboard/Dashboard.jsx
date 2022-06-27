import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { Typography, List, Divider, ListItemButton, Button, IconButton, Tooltip, ListItemSecondaryAction } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Copyright from "../layout/Copyright";
import React from 'react';
import ListItemText from '@mui/material/ListItemText';


const Dashboard = () => {
    const [polls, setPolls] = useState([]);
    const [render, setRender] = useState(false);
    const [noData, setNoData] = useState(false);
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
      setOpen(!open);
    };

    async function getPolls() {
        const token = window.localStorage.getItem('token')

        const options = {
            url: 'api/posts',
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        };

        const res = await axios(options)

        if (res.data.length === 0) {
            setNoData(true);
        }

        setPolls(res.data);
        setRender(true);
    }

    useEffect(() => {
        getPolls();
    }, []);

    const myTheme = createTheme({
        palette: {
            primary: {
              main: '#000000',
            },
        },
    });

    return (
        <div className="dashboard">
            <Typography variant='h3' style={{fontWeight: 'bolder'}} className="create-poll-heading">Your Polls</Typography>
            {noData && <Typography style={{marginTop: '30px'}} variant="h3">You have no polls</Typography>}
            <ThemeProvider theme={myTheme}>
                <a href="dashboard/create">  
                    <Button variant="outlined" size="large" style={{marginTop: '30px', width: '30%', minWidth: '250px'}}>Create Poll</Button>
                </a>
            </ThemeProvider>
            <List className="polls-list">
                {render && polls.map((poll, index) => (
                    <Fragment key={index}>
                        <a href={`/polls/${poll._id}`}>
                            <ListItemButton>
                                <ListItemSecondaryAction>
                                    <Tooltip title='Votes'>
                                        <Typography>
                                            <b style={{color: 'green'}}>{poll.option1.votes.length}</b> - <b style={{color: 'red'}}>{poll.option2.votes.length}</b>
                                        </Typography>
                                    </Tooltip>

                                </ListItemSecondaryAction>
                                <ListItemText primary={poll.title} secondary={poll.description}/>
                            </ListItemButton>
                        </a>
                        { index < polls.length-1 && <Divider />}
                    </Fragment>
                ))}
            </List>
            <Copyright style={{marginTop: '20px'}}></Copyright>
        </div>
    )
}

export default Dashboard;