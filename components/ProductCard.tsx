import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, X, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();
  const [showOptions, setShowOptions] = useState(false);
  
  // Default selections
  const [selectedSize, setSelectedSize] = useState(product.available_sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.available_colors?.[0] || 'Standard');

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setShowOptions(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100 relative group">
        <div className="relative aspect-[3/4] w-full bg-gray-200">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-800">
            {product.category}
          </div>
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-indigo-600">
              {product.price.toLocaleString('fr-FR')} F
            </span>
            <button
              onClick={() => setShowOptions(true)}
              className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 active:scale-95 transition-transform"
              aria-label="Choisir options"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-friendly Variant Selection Modal */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-slide-up relative">
            <button 
              onClick={() => setShowOptions(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="flex gap-4 mb-6">
              <img src={product.image_url} className="w-20 h-24 object-cover rounded-lg bg-gray-100" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="text-indigo-600 font-bold text-lg">{product.price.toLocaleString()} FCFA</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Size Selector */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Taille</label>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedSize === size
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Couleur</label>
                  <div className="flex flex-wrap gap-2">
                    {product.available_colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedColor === color
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95 transition-all"
            >
              <ShoppingBag size={20} />
              Ajouter au panier
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;