import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, MapPin, Phone, Truck, CheckCircle } from 'lucide-react';
import { api } from '../services/supabase';

const DELIVERY_FEES = {
  abidjan: 1500,
  outside: 2000,
};

const CartCheckout: React.FC<{ goHome: () => void }> = ({ goHome }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);

  // Form State
  const [phone, setPhone] = useState('');
  const [cityType, setCityType] = useState<'Abidjan' | 'Hors Abidjan'>('Abidjan');
  const [address, setAddress] = useState('');

  const deliveryFee = cityType === 'Abidjan' ? DELIVERY_FEES.abidjan : DELIVERY_FEES.outside;
  const totalWithDelivery = cartTotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) return;

    setLoading(true);
    try {
      await api.createOrder({
        customer_phone: phone,
        customer_city: cityType,
        customer_address: address,
        total_amount: totalWithDelivery,
        delivery_fee: deliveryFee,
        items: cart,
      });
      clearCart();
      setStep('success');
    } catch (err) {
      alert("Une erreur est survenue lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande Reçue !</h2>
        <p className="text-gray-500 mb-8">
          Merci pour votre commande. Nous vous contacterons bientôt au <span className="font-semibold text-gray-800">{phone}</span> pour la livraison.
        </p>
        <button
          onClick={goHome}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-gray-800 transition-colors w-full max-w-xs"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <MapPin className="text-gray-400" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Découvrez nos articles et commencez votre shopping.</p>
        <button
          onClick={goHome}
          className="text-indigo-600 font-medium hover:text-indigo-700"
        >
          Voir les produits
        </button>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <button onClick={() => setStep('cart')} className="text-gray-500 text-sm mb-4 hover:text-gray-800">
          ← Retour au panier
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Finaliser la commande</h2>
        
        <form onSubmit={handleCheckout} className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07 07 07 07 07"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville de livraison</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCityType('Abidjan')}
                  className={`py-3 px-2 rounded-lg text-sm font-medium border ${
                    cityType === 'Abidjan'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  Abidjan (1500F)
                </button>
                <button
                  type="button"
                  onClick={() => setCityType('Hors Abidjan')}
                  className={`py-3 px-2 rounded-lg text-sm font-medium border ${
                    cityType === 'Hors Abidjan'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  Intérieur (2000F)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse / Commune / Quartier</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Cocody, Riviera 2, près de la pharmacie..."
                rows={3}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Sous-total</span>
              <span>{cartTotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Livraison ({cityType})</span>
              <span>{deliveryFee.toLocaleString()} FCFA</span>
            </div>
            <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold text-gray-900 text-lg">
              <span>Total à payer</span>
              <span>{totalWithDelivery.toLocaleString()} FCFA</span>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center gap-1">
              <Truck size={14} /> Paiement à la livraison uniquement
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Traitement...' : 'Confirmer la commande'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Panier ({cart.length})</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500">Taille: {item.size}</p>
                <p className="text-sm font-semibold text-indigo-600">{item.price.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 text-lg font-bold px-1">-</button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 text-lg font-bold px-1">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-full">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total panier</span>
          <span className="text-xl font-bold text-gray-900">{cartTotal.toLocaleString()} FCFA</span>
        </div>
        <button
          onClick={() => setStep('checkout')}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors"
        >
          Passer à la caisse
        </button>
      </div>
    </div>
  );
};

export default CartCheckout;