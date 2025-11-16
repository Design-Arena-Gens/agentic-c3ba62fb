'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, updateDoc, doc, or } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trade } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Check, X, Mail, Clock } from 'lucide-react';

export default function TradesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sentTrades, setSentTrades] = useState<Trade[]>([]);
  const [receivedTrades, setReceivedTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTrades();
    }
  }, [user, authLoading, router]);

  const fetchTrades = async () => {
    if (!user) return;
    try {
      // Fetch received trades
      const receivedQuery = query(
        collection(db, 'trades'),
        where('toUserId', '==', user.uid)
      );
      const receivedSnapshot = await getDocs(receivedQuery);
      const receivedData = receivedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Trade[];

      // Fetch sent trades
      const sentQuery = query(
        collection(db, 'trades'),
        where('fromUserId', '==', user.uid)
      );
      const sentSnapshot = await getDocs(sentQuery);
      const sentData = sentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Trade[];

      setReceivedTrades(receivedData);
      setSentTrades(sentData);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast.error('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTrade = async (trade: Trade) => {
    try {
      await updateDoc(doc(db, 'trades', trade.id), {
        status: 'accepted',
        updatedAt: new Date(),
      });
      toast.success('Trade accepted!');
      fetchTrades();
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept trade');
    }
  };

  const handleRejectTrade = async (trade: Trade) => {
    try {
      await updateDoc(doc(db, 'trades', trade.id), {
        status: 'rejected',
        updatedAt: new Date(),
      });
      toast.success('Trade rejected');
      fetchTrades();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject trade');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const TradeCard = ({ trade, isReceived }: { trade: Trade; isReceived: boolean }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Mail className="text-purple-600" size={24} />
          <div>
            <div className="font-semibold text-gray-800">
              {isReceived ? `From: ${trade.fromUserName}` : `To: ${trade.toUserName}`}
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(trade.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
        {getStatusBadge(trade.status)}
      </div>

      {trade.toItemImage && (
        <div className="mb-4">
          <img
            src={trade.toItemImage}
            alt={trade.toItemTitle}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Item:</div>
        <div className="font-semibold text-gray-800">{trade.toItemTitle}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Message:</div>
        <p className="text-gray-700">{trade.message}</p>
      </div>

      {isReceived && trade.status === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={() => handleAcceptTrade(trade)}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            <Check size={20} />
            <span>Accept</span>
          </button>
          <button
            onClick={() => handleRejectTrade(trade)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            <X size={20} />
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Trade Offers</h1>
          <p className="text-lg">Manage your incoming and outgoing trades</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === 'received'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Received ({receivedTrades.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === 'sent'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sent ({sentTrades.length})
          </button>
        </div>

        {activeTab === 'received' ? (
          receivedTrades.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-xl text-gray-600">No received trade offers yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receivedTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} isReceived={true} />
              ))}
            </div>
          )
        ) : sentTrades.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <Mail className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-xl text-gray-600">No sent trade offers yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sentTrades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} isReceived={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
