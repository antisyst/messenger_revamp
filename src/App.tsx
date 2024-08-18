import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatList from './components/ChatList/ChatList';
import ChatViewWrapper from './components/ChatViewWrapper/ChatViewWrapper';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          <div className="chat-list-container">
            <ChatList />
          </div>
          <div className="chat-view-container">
            <Routes>
              <Route path="/chat/:id" element={<ChatViewWrapper />} />
              <Route path="/" element={<div className='select-chat'>Select chat</div>} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
