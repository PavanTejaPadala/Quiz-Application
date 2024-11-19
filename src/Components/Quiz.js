// src/Components/Quiz.js
import React, { useEffect, useState, useRef } from 'react';
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from '../Api';
import { Box, Button, Card, CardContent, CardHeader, IconButton, LinearProgress, List, ListItemButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getFormatedTime } from '../Helper';
import useStateContext from '../Hooks/useStateContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function Quiz() {
  const [qns, setQns] = useState([]);
  const [qnIndex, setQnIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const { context, setContext } = useStateContext();
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { category } = useParams();

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);
  };

  const fetchQuestions = (category) => {
    createAPIEndpoint(ENDPOINTS.questionsByCategory)
      .fetchByCategory(category)
      .then((res) => {
        setQns(res.data);
        startTimer();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setContext({
      timeTaken: 0,
      selectedOptions: [],
    });

    fetchQuestions(category);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [category]);

  const updateAnswer = (qnId, optionIdx) => {
    if (!Array.isArray(context.selectedOptions)) {
      console.error('selectedOptions is not an array:', context.selectedOptions);
      return;
    }

    const existingAnswerIndex = context.selectedOptions.findIndex(
      (option) => option.qnId === qnId
    );

    let newSelectedOptions;
    if (existingAnswerIndex !== -1) {
      newSelectedOptions = context.selectedOptions.map((option, idx) =>
        idx === existingAnswerIndex ? { ...option, selected: optionIdx } : option
      );
    } else {
      newSelectedOptions = [...context.selectedOptions, { qnId, selected: optionIdx }];
    }

    setContext({ selectedOptions: newSelectedOptions });

    if (qnIndex < qns.length - 1) {
      setQnIndex((prevIndex) => prevIndex + 1);
    } else {
      setContext({ selectedOptions: newSelectedOptions, timeTaken });
      navigate('/result');
    }
  };

  const handleBack = () => {
    if (qnIndex > 0) {
      setQnIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleChangeTopic = () => {
    setQnIndex(0);
    setTimeTaken(0);
    setContext({ timeTaken: 0, selectedOptions: [] });
    navigate('/topics'); 
  };

  return (
    qns.length !== 0 ? (
      <Card
        sx={{
          maxWidth: 640,
          mx: 'auto',
          mt: 5,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardHeader
          title={
            <>
              <Button 
                variant="outlined" 
                onClick={handleChangeTopic} 
                sx={{
                  mb: 1,
                  alignSelf: 'flex-start',
                }}
              >
                Change Topic
              </Button>
              <Typography variant="h6">
                Scenario Based Questions ({qnIndex + 1} of {qns.length})
              </Typography>
            </>
          }
          action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
        />
        <Box>
          <LinearProgress variant='determinate' value={(qnIndex + 1) * 100 / qns.length} />
        </Box>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={handleBack} disabled={qnIndex === 0}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                ml: 2,
                fontWeight: '600',
                color: '#333',
                backgroundColor: '#f0f0f0',
                padding: '10px 15px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #ccc',
                flexGrow: 1,
              }}
            >
              Topic: <span style={{ fontWeight: '700', color: '#1976d2' }}>{category}</span>
            </Typography>
          </Box>
          <Typography variant='h6'>{qns[qnIndex].qnInWords}</Typography>
          <List>
            {qns[qnIndex].options.map((item, idx) => (
              <ListItemButton key={idx} onClick={() => updateAnswer(qns[qnIndex].qnId, idx)}>
                <div>
                  <b>{String.fromCharCode(65 + idx) + " . "}</b> {item}
                </div>
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
    ) : null
  );
}
