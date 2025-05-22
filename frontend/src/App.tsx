import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './components/profile/ProfilePage';
import SettingsPage from './components/settings/SettingsPage';
import HomePage from './pages/HomePage';
import AskQuestionPage from './pages/AskQuestionPage';
import MainLayout from './layout/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import { ProtectedRoute } from './components/ProtectedRoutes';
import QuestionPage from './components/question/QuestionPage';
import { QuizPage } from './quiz/pages/QuizPage'; 
import { LeaderboardPage } from './quiz/pages/LeaderboardPage';
import AllQuestionListPage from './pages/question/AllQuestionListPage';
import AllUserListPage from './pages/user/AllUserListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout> <HomePage /> </MainLayout>} />
        <Route element={<ProtectedRoute />} >
          <Route path="/profile/:id" element={<MainLayout> <ProfilePage /> </MainLayout>} />
        </Route>
        <Route element={<ProtectedRoute />} >
          <Route path='settings' element={<MainLayout> <SettingsPage /> </MainLayout>} />
        </Route>
        <Route element={<ProtectedRoute />} >
          <Route path="/ask" element={<MainLayout> <AskQuestionPage /> </MainLayout>} />
        </Route>
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/question/:id" element={<MainLayout> <QuestionPage /> </MainLayout>} />
        <Route path="/allQuestions" element={<MainLayout> <AllQuestionListPage/> </MainLayout>} />
        <Route path="/allUsers" element={<MainLayout> <AllUserListPage/></MainLayout>} />


        <Route element={<ProtectedRoute />} >
          <Route path="/quizzes" element={<MainLayout><QuizPage /></MainLayout>} />
        </Route>
        <Route element={<ProtectedRoute />} >
          <Route path="/quizzes/leaderboard" element={<MainLayout><LeaderboardPage /></MainLayout>} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;
