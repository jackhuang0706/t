import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalQuizzes: 0,
    totalStudents: 0
  });

  useEffect(() => {
    // 獲取統計數據
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/teachers/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">教師儀表板</Typography>
        </Grid>
        
        {/* 快速操作按鈕 */}
        <Grid item xs={12}>
          <Paper style={{ padding: 20 }}>
            <Grid container spacing={2}>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/teacher/questions')}
                >
                  管理題目
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/teacher/create-quiz')}
                >
                  創建測驗
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/teacher/students')}
                >
                  管理學生
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 統計資訊 */}
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">統計資訊</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="總題目數" 
                  secondary={stats.totalQuestions} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="總測驗數" 
                  secondary={stats.totalQuizzes} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="學生人數" 
                  secondary={stats.totalStudents} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default TeacherDashboard; 