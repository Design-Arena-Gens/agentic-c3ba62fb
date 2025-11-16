'use client';

import { Item } from '@/types';
import { MapPin, Calendar, Share2, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  onShare?: (item: Item) => void;
}

export default function ItemCard({
  item,
  showActions = false,
  onEdit,
  onDelete,
  onShare,
}: ItemCardProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.origin + '/items/' + item.id,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else if (onShare) {
      onShare(item);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <Link href={`/items/${item.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-200">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {item.category}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/items/${item.id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-purple-600 transition">
            {item.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            {item.condition.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-3">
          <div className="flex items-center space-x-2">
            {item.userPhoto ? (
              <img
                src={item.userPhoto}
                alt={item.userName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-white text-xs">
                {item.userName?.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{item.userName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{format(new Date(item.createdAt), 'MMM d')}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="flex-1 flex items-center justify-center space-x-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="flex-1 flex items-center justify-center space-x-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
