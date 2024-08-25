import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuth from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import LanguageSwitcher from './components/Switcher/Switcher';

const queryClient = new QueryClient();

const ChatList = React.lazy(() => import('./components/ChatList/ChatList'));
const ChatViewWrapper = React.lazy(() => import('./components/ChatViewWrapper/ChatViewWrapper'));
const AuthForm = React.lazy(() => import('./components/AuthForm/AuthForm'));

const App: React.FC = () => {
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate('/chat/1', { replace: true });
    }
  }, [accessToken, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <LanguageSwitcher />
          {accessToken ? (
            <div className="app-container">
              <div className="chat-list-container">
                <ChatList />
              </div>
              <div className="chat-view-container">
                <Routes>
                  <Route path="/chat/:id" element={<ChatViewWrapper accessToken={accessToken} />} />
                  <Route path="/" element={<div>Welcome! Please select a chat.</div>} />
                  <Route path="*" element={<div>404 - Not Found</div>} />
                </Routes>
              </div>
            </div>
          ) : (
            <AuthForm onAuthSuccess={(token) => setAccessToken(token)} />
          )}
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

const WrappedApp: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;