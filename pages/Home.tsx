import React, { useEffect, useState } from 'react';
import { api } from '../services/supabase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tous', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Tous' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">MenStyle CI</h1>
        <p className="text-gray-500 text-sm">La meilleure mode homme à Abidjan</p>
      </header>

      {/* Search & Filter */}
      <div className="sticky top-0 bg-gray-50 z-40 py-2 -mx-4 px-4 mb-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              Aucun produit trouvé.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;