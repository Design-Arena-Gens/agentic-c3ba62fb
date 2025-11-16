'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Item } from '@/types';
import { ChevronLeft, ChevronRight, Send, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [sendingOffer, setSendingOffer] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      const itemDoc = await getDoc(doc(db, 'items', params.id));
      if (itemDoc.exists()) {
        const itemData = {
          id: itemDoc.id,
          ...itemDoc.data(),
          createdAt: itemDoc.data().createdAt?.toDate(),
          updatedAt: itemDoc.data().updatedAt?.toDate(),
        } as Item;
        setItem(itemData);
      } else {
        toast.error('Item not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async () => {
    if (!user || !userData || !item) {
      toast.error('Please login to send offers');
      router.push('/login');
      return;
    }

    if (item.userId === user.uid) {
      toast.error("You can't trade with yourself!");
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSendingOffer(true);
    try {
      await addDoc(collection(db, 'trades'), {
        fromUserId: user.uid,
        toUserId: item.userId,
        fromUserName: userData.displayName,
        toUserName: item.userName,
        toItemId: item.id,
        toItemTitle: item.title,
        toItemImage: item.images?.[0] || null,
        message,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success('Trade offer sent!');
      setMessage('');
      router.push('/trades');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send offer');
    } finally {
      setSendingOffer(false);
    }
  };

  const nextImage = () => {
    if (item && item.images) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item && item.images) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              {item.images && item.images.length > 0 && (
                <>
                  <div className="aspect-square bg-gray-200 overflow-hidden">
                    <img
                      src={item.images[currentImageIndex]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {item.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex
                                ? 'bg-white'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.category}
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.condition.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{item.description}</p>

              <div className="border-t border-b py-4 mb-6 space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  {item.userPhoto ? (
                    <img
                      src={item.userPhoto}
                      alt={item.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">
                      {item.userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{item.userName}</div>
                    <div className="text-sm text-gray-500">Item Owner</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={18} />
                  <span>Posted {format(new Date(item.createdAt), 'MMMM d, yyyy')}</span>
                </div>
              </div>

              {user && item.userId !== user.uid && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Send Trade Offer
                  </h3>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell them what you'd like to trade..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    rows={4}
                  />
                  <button
                    onClick={handleSendOffer}
                    disabled={sendingOffer}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Send size={20} />
                    <span>{sendingOffer ? 'Sending...' : 'Send Offer'}</span>
                  </button>
                </div>
              )}

              {!user && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <p className="text-purple-800 mb-3">Login to send a trade offer</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
