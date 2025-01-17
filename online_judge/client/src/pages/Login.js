import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  FormControl,
  Select,
  MenuItem
} from '@material-ui/core';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        navigate(data.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" align="center">登入系統</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="用戶名"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            label="密碼"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <FormControl fullWidth margin="normal">
            <Select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <MenuItem value="student">學生</MenuItem>
              <MenuItem value="teacher">教師</MenuItem>
            </Select>
          </FormControl>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            style={{ marginTop: 20 }}
          >
            登入
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login; 