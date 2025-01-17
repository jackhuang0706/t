import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/quizzes/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const getStatusChip = (quiz) => {
    const now = new Date();
    const startTime = new Date(quiz.startTime);
    const endTime = new Date(quiz.endTime);

    if (now < startTime) {
      return <Chip label="即將開始" color="primary" variant="outlined" />;
    } else if (now > endTime) {
      return <Chip label="已結束" color="default" />;
    } else {
      return <Chip label="進行中" color="primary" />;
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">可用測驗</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <List>
              {quizzes.map((quiz) => (
                <ListItem key={quiz._id}>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {quiz.title}
                        {getStatusChip(quiz)}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          題目數量: {quiz.questions.length} | 時間限制: {quiz.timeLimit}分鐘
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          開始時間: {new Date(quiz.startTime).toLocaleString()}
                          <br />
                          結束時間: {new Date(quiz.endTime).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/student/quiz/${quiz._id}`)}
                    disabled={new Date() < new Date(quiz.startTime) || new Date() > new Date(quiz.endTime)}
                  >
                    開始測驗
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default QuizList; 