import React, { useEffect, useState } from 'react'
import useStateContext from '../Hooks/useStateContext'
import { ENDPOINTS, createAPIEndpoint } from '../Api';
import { Box } from '@mui/system';
import { Alert, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { getFormatedTime } from '../Helper';
import { useNavigate } from 'react-router-dom';
import { green } from '@mui/material/colors';
import Answer from './Answer';

export default function Result() {
    const { context,setContext } = useStateContext();
    const [score, setScore] = useState(0);
    const [qnAnswers, setQnAnswers] = useState([]);
    const navigate = useNavigate();
    const [showAlert,setShowAlert] = useState(false);

    const restart=()=>{
        setContext({
            timeTaken:0,
            selectedOptions: []
          })
          navigate('/Topics')
    }

    const submitScore=()=>{
        createAPIEndpoint(ENDPOINTS.participant)
        .update(context.participantID,{
            participantID:context.participantID,
            score:score,
            timeTaken:context.timeTaken
        })
        .then(res=>{setShowAlert(true)
        setTimeout(()=>{
            setShowAlert(false)
        },4000);
    })
        .catch(err=>{console.log(err)})
    }

    useEffect(() => {
        const ids = context.selectedOptions.map(x => x.qnId);
        createAPIEndpoint(ENDPOINTS.getAnswers)
            .create(ids)
            .then(res => {
                const qna = context.selectedOptions
                    .map(x => ({
                        ...x,
                        ...(res.data.find(y => y.qnId === x.qnId))
                    }));
                setQnAnswers(qna);
                calculateScore(qna);
            })
            .catch(err => console.log(err));
    }, []);

    const calculateScore = qna => {
        let temp = qna.reduce((acc, curr) => {
            
            return curr.answer === curr.selected ? acc + 1 : acc;
        }, 0);
        setScore(temp);
    };

    return (
        <>
            <Card sx={{ mt: 5, display: 'flex', width: '100%', maxWidth: 640, mx: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
                        <Typography variant="h4">Congratulations!</Typography>
                        <Typography variant="h6">YOUR SCORE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            <Typography variant="span" color={green[500]}>
                                {score}
                            </Typography>/10
                        </Typography>
                        <Typography variant="h6">
                            Took {getFormatedTime(context.timeTaken) + ' mins'}
                        </Typography>
                        <Button variant="contained"
              sx={{ mx: 1 }}
              size="small" 
              onClick={submitScore}>
              Submit
            </Button>
            <Button variant="contained"
              sx={{ mx: 1 }}
              size="small"
              onClick={restart}>
              Re-try
            </Button>
            <Alert
              severity="success"
              variant="string"
              sx={{
                width:'60%',
                m:'auto',
                visibility: showAlert ? 'visible' : 'hidden'
              }}>
              Score Updated.
            </Alert>
                    </CardContent>
                </Box>
                <CardMedia
                    component="img"
                    sx={{ width: 220 }}
                    image="./result.jpg"
                />
            </Card>
            <Answer qnAnswers={qnAnswers}></Answer>
        </>
    );
}
