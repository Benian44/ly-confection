import React from 'react';
import { Home, ShoppingBag, Settings } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface BottomNavProps {
  currentView: string;
  setView: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const { cartCount } = useStore();

  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'cart', icon: ShoppingBag, label: 'Panier', badge: cartCount },
    { id: 'admin', icon: Settings, label: 'Admin' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-safe-area shadow-lg z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;