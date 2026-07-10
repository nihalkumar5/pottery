import { useState, useEffect } from 'react';
import DesktopApp from './DesktopApp';
import MobileApp from './MobileApp';
import { ShopProvider } from './ShopContext';
import PolicyPage from './PolicyPages';
import DesktopCollections from './DesktopCollections';

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

  return (
    <ShopProvider>
      {currentPage !== 'home' && currentPage !== 'shop' && currentPage !== 'about' && currentPage !== 'About Us' && currentPage !== 'Contact Us' ? (
        <PolicyPage page={currentPage} onBack={() => setCurrentPage('home')} isMobile={isMobile} />
      ) : isMobile ? (
        <MobileApp setCurrentPage={setCurrentPage} />
      ) : (
        <DesktopApp setCurrentPage={setCurrentPage} currentPage={currentPage} />
      )}
    </ShopProvider>
  );
}

export default App;
