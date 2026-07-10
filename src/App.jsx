import React, { useState, useEffect } from 'react';
import DesktopApp from './DesktopApp';
import MobileApp from './MobileApp';
import { ShopProvider } from './ShopContext';
import PolicyPage from './PolicyPages';
import DesktopCollections from './DesktopCollections';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(() => {
    return sessionStorage.getItem('currentPage') || 'home';
  });

  useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <ShopProvider>
        {currentPage !== 'home' && currentPage !== 'shop' && currentPage !== 'about' && currentPage !== 'About Us' && currentPage !== 'Contact Us' ? (
          <PolicyPage page={currentPage} onBack={() => setCurrentPage('home')} isMobile={isMobile} />
        ) : isMobile ? (
          <MobileApp setCurrentPage={setCurrentPage} currentPage={currentPage} />
        ) : (
          <DesktopApp setCurrentPage={setCurrentPage} currentPage={currentPage} />
        )}
      </ShopProvider>
    </ErrorBoundary>
  );
}

export default App;
