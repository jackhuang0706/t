import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import QuestionManager from './pages/QuestionManager';
import QuizCreator from './pages/QuizCreator';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import Practice from './pages/Practice';
import PrivateRoute from './components/PrivateRoute';
import NavMenu from './components/NavMenu';

const theme = createTheme();

function App() {
  const token = localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {token && <NavMenu />}
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* 教師路由 */}
          <Route path="/teacher/*" element={
            <PrivateRoute allowedRole="teacher">
              <Routes>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="questions" element={<QuestionManager />} />
                <Route path="create-quiz" element={<QuizCreator />} />
              </Routes>
            </PrivateRoute>
          } />

          {/* 學生路由 */}
          <Route path="/student/*" element={
            <PrivateRoute allowedRole="student">
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="quizzes" element={<QuizList />} />
                <Route path="quiz/:quizId" element={<TakeQuiz />} />
                <Route path="practice" element={<Practice />} />
              </Routes>
            </PrivateRoute>
          } />

          {/* 默認路由重定向 */}
          <Route path="/" element={
            <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 