import { useState } from 'react';
import Home from './components/Home';
import Sender from './components/Sender';
import Receiver from './components/Receiver';
import Help from './components/Help';

type Page = 'home' | 'sender' | 'receiver' | 'help';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  function handleNavigate(page: Page) {
    setCurrentPage(page);
  }

  return (
    <>
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'sender' && <Sender onNavigate={handleNavigate} />}
      {currentPage === 'receiver' && <Receiver onNavigate={handleNavigate} />}
      {currentPage === 'help' && <Help onNavigate={handleNavigate} />}
    </>
  );
}

export default App;
