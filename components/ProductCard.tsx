import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100">
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
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
          <button
            onClick={() => addToCart(product)}
            className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 active:scale-95 transition-transform"
            aria-label="Ajouter au panier"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;