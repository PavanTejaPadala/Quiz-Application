import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

const topics = [
    'Design Patterns',
    'Object-Oriented Programming',
    'Data Structures',
    'Algorithms'
    // Add more topics as needed
];

export default function Topics() {
    const navigate = useNavigate();

    const handleTopicClick = (topic) => {
        // Navigate to the Quiz page with the selected topic
        navigate(`/quiz/${topic}`);
    };

    return (
        <Box sx={{ mx: 'auto', mt: 5, textAlign: 'center' }}>
            <Card sx={{ width: '400px', mx: 'auto' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Select a Quiz Topic
                    </Typography>
                    {topics.map((topic, index) => (
                        <Button
                            key={index}
                            variant="outlined"  // Use outlined style for the button
                            onClick={() => handleTopicClick(topic)}
                            sx={{
                                m: 1,
                                width: '90%',  // Make button full width within the card
                                border: '1px solid rgba(0, 0, 0, 0.2)',  // Add border for neat outlines
                                '&:hover': {
                                    border: '1px solid rgb(58, 141, 255)', // Change border color on hover
                                },
                            }}
                        >
                            {topic}
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
}
