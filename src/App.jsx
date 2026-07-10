import { useState, useEffect } from 'react';
import DesktopApp from './DesktopApp';
import MobileApp from './MobileApp';
import { ShopProvider } from './ShopContext';
import PolicyPage from './PolicyPages';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (currentPage !== 'home') {
    return <PolicyPage page={currentPage} onBack={() => setCurrentPage('home')} isMobile={isMobile} />;
  }

  return (
    <ShopProvider>
      {isMobile ? <MobileApp setCurrentPage={setCurrentPage} /> : <DesktopApp setCurrentPage={setCurrentPage} />}
    </ShopProvider>
  );
}

export default App;
