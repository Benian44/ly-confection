import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Home from './pages/Home';
import CartCheckout from './pages/CartCheckout';
import Admin from './pages/Admin';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'cart':
        return <CartCheckout goHome={() => setCurrentView('home')} />;
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <main className="min-h-screen">
          {renderView()}
        </main>
        <BottomNav currentView={currentView} setView={setCurrentView} />
      </div>
    </StoreProvider>
  );
};

export default App;