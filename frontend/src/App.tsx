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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout> <HomePage /> </MainLayout>} />
        <Route element={<ProtectedRoute />} >
          <Route path="/profile" element={<MainLayout> <ProfilePage /> </MainLayout>} />
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
      </Routes>
    </Router>
  );
}

export default App;
