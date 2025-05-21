import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './components/profile/ProfilePage';
import SettingsPage from './components/settings/SettingsPage';
import HomePage from './pages/HomePage';
import AskQuestionPage from './pages/AskQuestionPage';
import MainLayout from './layout/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          }
        />
        <Route
          path="/ask"
          element={
            <MainLayout>
              <AskQuestionPage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register/></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
