import React, { useState, useEffect } from 'react';
import { api } from '../services/supabase';
import { Order, Product, OrderStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, Package, DollarSign, ShoppingCart, LogOut, Phone } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'dashboard' | 'orders' | 'products'>('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Chemises',
    image_url: 'https://picsum.photos/400/500',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded check for demo. In production, use Supabase Auth.
    if (password === 'admin123') {
      setIsAuthenticated(true);
      loadData();
    } else {
      alert("Mot de passe incorrect (Essayez 'admin123')");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, productsData] = await Promise.all([
        api.getStats(),
        api.getOrders(),
        api.getProducts(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    setLoading(true);
    try {
      await api.addProduct({
        name: newProduct.name,
        price: parseInt(newProduct.price),
        category: newProduct.category,
        image_url: newProduct.image_url
      });
      setNewProduct({ name: '', price: '', category: 'Chemises', image_url: 'https://picsum.photos/400/500' });
      alert('Produit ajouté !');
      loadData(); // Reload
    } catch (e) {
      alert('Erreur ajout produit');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[80vh] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe (admin123)"
            className="w-full mb-4 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800">
            Connexion
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
          <LogOut size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'orders', label: 'Commandes' },
          { id: 'products', label: 'Produits' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === tab.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-4">Chargement...</div>}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && stats && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <ShoppingCart size={16} /> <span className="text-xs font-bold uppercase">Commandes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <DollarSign size={16} /> <span className="text-xs font-bold uppercase">Revenus</span>
              </div>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalRevenue.toLocaleString()} F</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenus Mensuels</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f3f4f6'}}
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* VIEW: ORDERS */}
      {view === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">CMD #{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'pending' ? 'En attente' : order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1"><Phone size={14}/> {order.customer_phone}</p>
                <p className="text-sm text-gray-600">{order.customer_city} - {order.customer_address}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="font-bold text-lg text-indigo-600">{order.total_amount.toLocaleString()} FCFA</span>
                <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-gray-500">Aucune commande.</p>}
        </div>
      )}

      {/* VIEW: ADD PRODUCT */}
      {view === 'products' && (
        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus size={20} /> Ajouter un produit
            </h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du produit"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
               <input
                type="number"
                placeholder="Prix (FCFA)"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                className="p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                className="p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option>Chemises</option>
                <option>Pantalons</option>
                <option>T-shirts</option>
                <option>Vestes</option>
                <option>Chaussures</option>
                <option>Accessoires</option>
              </select>
               <input
                type="text"
                placeholder="URL Image"
                value={newProduct.image_url}
                onChange={e => setNewProduct({...newProduct, image_url: e.target.value})}
                className="p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" disabled={loading} className="md:col-span-2 bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800">
                {loading ? 'Ajout...' : 'Ajouter le produit'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {products.map(p => (
               <div key={p.id} className="bg-white p-2 rounded-lg border border-gray-100 flex gap-2 items-center">
                 <img src={p.image_url} alt="" className="w-12 h-12 rounded bg-gray-100 object-cover" />
                 <div className="overflow-hidden">
                   <p className="font-medium text-sm truncate">{p.name}</p>
                   <p className="text-xs text-gray-500">{p.price} F</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;