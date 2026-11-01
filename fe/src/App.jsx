import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import { fetchMeThunk, logout } from './redux/authSlice';
import { fetchTasks, clearTasks } from './redux/tasksSlice';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import OnboardingTour from './components/onboarding/OnboardingTour';
import './index.css';

function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <Footer />
      <OnboardingTour />
    </div>
  );
}

function AppBootstrap() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);
  const user  = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (token && !user) dispatch(fetchMeThunk());
  }, [token, user, dispatch]);

  useEffect(() => {
    if (token) dispatch(fetchTasks());
    else dispatch(clearTasks());
  }, [token, dispatch]);

  useEffect(() => {
    const onUnauthorized = () => {
      dispatch(logout());
      dispatch(clearTasks());
      navigate('/login', { replace: true });
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, [dispatch, navigate]);

  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppBootstrap />
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/"                         element={<Dashboard />} />
              <Route path="/tasks"                    element={<TaskList />} />
              <Route path="/tasks/category/:category" element={<TaskList />} />
              <Route path="/tasks/:id"                element={<TaskDetail />} />
              <Route path="/settings"                 element={<Settings />} />
              <Route path="*"                         element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
