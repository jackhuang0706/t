import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { AccountCircle, ExitToApp } from '@material-ui/icons';

function NavMenu() {
  const navigate = useNavigate();
  const [quizAnchorEl, setQuizAnchorEl] = useState(null);
  const [practiceAnchorEl, setPracticeAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          線上測驗系統
        </Typography>

        {userRole === 'teacher' ? (
          // 教師選單
          <>
            <Button 
              color="inherit" 
              onClick={() => navigate('/teacher/dashboard')}
            >
              儀表板
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/teacher/questions')}
            >
              題目管理
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/teacher/create-quiz')}
            >
              創建測驗
            </Button>
          </>
        ) : (
          // 學生選單
          <>
            <Button 
              color="inherit"
              onClick={(e) => setQuizAnchorEl(e.currentTarget)}
            >
              測驗
            </Button>
            <Menu
              anchorEl={quizAnchorEl}
              open={Boolean(quizAnchorEl)}
              onClose={() => setQuizAnchorEl(null)}
            >
              <MenuItem onClick={() => {
                navigate('/student/quizzes');
                setQuizAnchorEl(null);
              }}>
                所有測驗
              </MenuItem>
              <MenuItem onClick={() => {
                navigate('/student/quizzes/upcoming');
                setQuizAnchorEl(null);
              }}>
                即將開始
              </MenuItem>
              <MenuItem onClick={() => {
                navigate('/student/quizzes/completed');
                setQuizAnchorEl(null);
              }}>
                已完成
              </MenuItem>
            </Menu>

            <Button 
              color="inherit"
              onClick={(e) => setPracticeAnchorEl(e.currentTarget)}
            >
              練習題
            </Button>
            <Menu
              anchorEl={practiceAnchorEl}
              open={Boolean(practiceAnchorEl)}
              onClose={() => setPracticeAnchorEl(null)}
            >
              <MenuItem onClick={() => {
                navigate('/student/practice/random');
                setPracticeAnchorEl(null);
              }}>
                隨機練習
              </MenuItem>
              <MenuItem onClick={() => {
                navigate('/student/practice/by-category');
                setPracticeAnchorEl(null);
              }}>
                按類別練習
              </MenuItem>
              <MenuItem onClick={() => {
                navigate('/student/practice/wrong-questions');
                setPracticeAnchorEl(null);
              }}>
                錯題練習
              </MenuItem>
            </Menu>
          </>
        )}

        <IconButton 
          color="inherit"
          onClick={(e) => setProfileAnchorEl(e.currentTarget)}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={() => setProfileAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            navigate(`/${userRole}/profile`);
            setProfileAnchorEl(null);
          }}>
            個人資料
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp fontSize="small" style={{ marginRight: 8 }} />
            登出
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default NavMenu; 