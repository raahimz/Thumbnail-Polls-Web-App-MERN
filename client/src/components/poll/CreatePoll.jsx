import { TextField, Typography, Button, CircularProgress, Alert, Zoom } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import Copyright from '../layout/Copyright';
import React, {useEffect} from 'react';

let url1 = '';
let url2 = '';

const CreatePoll = (props) => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [desc, setDesc] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = React.useState([]);
    const [pollID, setPollID] = useState('');
    const [showLink, setShowLink] = useState(false);

    useEffect(() => {
        if (!props.isAuthenticated) {
            window.location.href = "/signin"
        }
    });

    function uploadFile(event) {
        if (title === '') {
            return setAlerts([...alerts, {severity: 'error', msg: 'Title is required'}]);
        } 
        if (!file1) {
            return setAlerts([...alerts, {severity: 'error', msg: 'Thumbnail 1 is required'}]);
        }
         if (!file2) {
            return setAlerts([...alerts, {severity: 'error', msg: 'Thumbnail 2 is required'}]);
        }

        setLoading(true);

        const UPLOAD_ENDPOINT = 'invalid';

        const files = [file1, file2];
        let i = 0
        files.forEach(async file => {
            setTimeout(async () => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "thumbnails");
        
                try {
                    let imgUrl = await axios.post(UPLOAD_ENDPOINT, formData);
                    imgUrl = imgUrl.data.secure_url;
                    
                    if (i === 0) {
                        url1 = imgUrl;
                    } else {
                        url2 = imgUrl;
                    }

                } catch (err) {
                    setAlerts([...alerts, {severity: 'error', msg: 'Server error'}]);
                }
                i++;
            }, 1000)
        })
        setTimeout(() => {uploadPoll()}, 5000);
    }

    async function uploadPoll() {
        let x;
        const token = window.localStorage.getItem('token');

        if (desc === '') {
            x = 'This poll has no description.'
        } else {
            x = desc;
        }

        const options = {
            url: '/api/posts',
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'x-auth-token': token
            },
            data: {
                title: title,
                description: x,
                option1: {url: url1, votes: []},
                option2: {url: url2, votes: []}
            }
        };

        axios(options)
            .then(res => {
                setPollID(res.data._id);
            })
            .catch(err => {
                setAlerts([...alerts, {severity: 'error', msg: 'Server error'}]);
            });
                    
        setLoading(false);
        setAlerts([...alerts, {severity: 'success', msg: `Poll created successfuly!`}]);
        setShowLink(true);
    }

    function deleteAlert(id) {
        setAlerts(prevItems => {
            return prevItems.filter((prevItem, index) => {
            return index !== id;
            });
        });
    }

    const myTheme = createTheme({
        palette: {
            primary: {
              main: '#000000',
            },
        },
    });

    return (
        <div className="create-poll">
            <Typography variant='h3' style={{fontWeight: 'bolder'}} className="create-poll-heading">Create Poll</Typography>
            <div className="create-poll-form">
                <Typography style={{color: 'rgba(0, 0, 0, 0.6)'}}>
                    Make sure you upload thumbnails of size <b>1280x720</b>/<b>16:9 ratio</b> as this is recommended for YouTube thumbnails.
                </Typography>
                <ThemeProvider theme={myTheme}>
                    <TextField onChange={(e) => {setTitle(e.target.value)}} style={{width: '100%'}} label="Title" variant="filled" />
                    <TextField onChange={(e) => {setDesc(e.target.value)}} multiline style={{width: '100%'}} rows={2} label="Description (optional)" variant="filled">/</TextField>
                    <input onChange={(e) => setFile1(e.target.files[0])} accept='.sjpg, .jpeg, .png' className='file-upload-button' style={{width: '100%'}} type="file" name="option1"></input>
                    <input onChange={(e) => setFile2(e.target.files[0])} accept='.jpg, .jpeg, .png' className='file-upload-button' style={{width: '100%'}} type="file" name="option2"></input>
                    <Button onClick={uploadFile} style={{width: '100%'}} size="normal" variant="contained">Upload</Button>
                    {loading && <CircularProgress />}
                </ThemeProvider>
            </div>
            {showLink && <Typography style={{marginTop: '20px'}}>View poll @ <a href={`/polls/${pollID}`}><b><u>https://shrouded-spire-35913.herokuapp.com/polls/{pollID}</u></b></a></Typography>}
            <div className='alerts' style={{width: '40%', margin: '10px auto 0px auto'}}>
                {alerts.map((alert, index) => <Zoom key={index} in={true}><Alert onClose={() => deleteAlert(index)} severity={alert.severity} sx={{ mt: 2 }}>{alert.msg}</Alert></Zoom>)}
            </div>
            <Copyright style={{marginTop: '20px'}}></Copyright>
        </div>
    )
}

export default CreatePoll;
