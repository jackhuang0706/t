import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Box
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    completedQuizzes: 0,
    averageScore: 0,
    practiceQuestions: 0
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [practiceRecords, setPracticeRecords] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchPracticeRecords();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setRecentQuizzes(data.recentQuizzes);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchPracticeRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/practice-records', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPracticeRecords(data);
    } catch (error) {
      console.error('Error fetching practice records:', error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">學生儀表板</Typography>
        </Grid>

        {/* 快速操作按鈕 */}
        <Grid item xs={12}>
          <Paper style={{ padding: 20 }}>
            <Grid container spacing={2}>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/student/quizzes')}
                >
                  參加測驗
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/student/practice')}
                >
                  練習題
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 統計資訊 */}
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">學習統計</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="已完成測驗" 
                  secondary={stats.completedQuizzes} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="平均分數" 
                  secondary={`${stats.averageScore}%`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="練習題數" 
                  secondary={stats.practiceQuestions} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* 測驗和練習記錄 */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="測驗記錄" />
              <Tab label="練習記錄" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <List>
                {recentQuizzes.map((quiz) => (
                  <ListItem key={quiz._id}>
                    <ListItemText
                      primary={quiz.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            分數: {quiz.score}%
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textSecondary">
                            完成時間: {new Date(quiz.completedAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <List>
                {practiceRecords.map((record) => (
                  <ListItem key={record._id}>
                    <ListItemText
                      primary={record.question.question}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color={record.isCorrect ? "primary" : "error"}>
                            {record.isCorrect ? '答對' : '答錯'}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            嘗試次數: {record.attemptCount}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textSecondary">
                            最後嘗試時間: {new Date(record.lastAttemptAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StudentDashboard; 