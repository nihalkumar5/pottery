import { useState, useEffect } from 'react';
import DesktopApp from './DesktopApp';
import MobileApp from './MobileApp';
import { ShopProvider } from './ShopContext';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ShopProvider>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </ShopProvider>
  );
}

export default App;
