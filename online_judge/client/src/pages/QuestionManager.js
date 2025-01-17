import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
import { Delete, Edit, Add } from '@material-ui/icons';

function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    type: 'single',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    category: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/questions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingQuestion
        ? `http://localhost:5000/api/questions/${editingQuestion._id}`
        : 'http://localhost:5000/api/questions';
      
      const method = editingQuestion ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setOpen(false);
        setEditingQuestion(null);
        setFormData({
          question: '',
          type: 'single',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          category: '',
          difficulty: ''
        });
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options,
      category: question.category,
      difficulty: question.difficulty
    });
    setOpen(true);
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      if (formData.type === 'single') {
        newOptions.forEach(option => option.isCorrect = false);
      }
      newOptions[index].isCorrect = value;
    } else {
      newOptions[index][field] = value;
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', isCorrect: false }]
    });
  };

  const handleRemoveOption = (indexToRemove) => {
    if (formData.options.length <= 2) {
      alert('至少需要兩個選項');
      return;
    }
    setFormData({
      ...formData,
      options: formData.options.filter((_, index) => index !== indexToRemove)
    });
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h5">題目管理</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              style={{ marginTop: 20 }}
            >
              新增題目
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <List>
              {questions.map((question) => (
                <ListItem key={question._id}>
                  <ListItemText
                    primary={
                      <Typography>
                        [{question.type === 'single' ? '單選' : '多選'}] {question.question}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          類別: {question.category} | 難度: {question.difficulty}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          正確答案: {
                            question.options
                              .filter(opt => opt.isCorrect)
                              .map(opt => opt.text)
                              .join(', ')
                          }
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleEdit(question)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(question._id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => {
        setOpen(false);
        setEditingQuestion(null);
        setFormData({
          question: '',
          type: 'single',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          category: '',
          difficulty: ''
        });
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? '編輯題目' : '新增題目'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="題目"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                  題目類型
                </Typography>
                <Button
                  variant={formData.type === 'single' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setFormData({ ...formData, type: 'single' })}
                  style={{ marginRight: 8 }}
                >
                  單選題
                </Button>
                <Button
                  variant={formData.type === 'multiple' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setFormData({ ...formData, type: 'multiple' })}
                >
                  多選題
                </Button>
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" style={{ marginTop: 16 }}>
              選項列表
            </Typography>
            {formData.options.map((option, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label={`選項 ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant={option.isCorrect ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleOptionChange(index, 'isCorrect', !option.isCorrect)}
                  >
                    正確答案
                  </Button>
                </Grid>
                <Grid item xs={1}>
                  <IconButton 
                    onClick={() => handleRemoveOption(index)}
                    disabled={formData.options.length <= 2}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddOption}
              style={{ marginTop: 16, marginBottom: 16 }}
              startIcon={<Add />}
              fullWidth
            >
              新增選項
            </Button>

            <TextField
              fullWidth
              margin="normal"
              label="類別"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />

            <TextField
              fullWidth
              margin="normal"
              label="難度"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            取消
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default QuestionManager; 