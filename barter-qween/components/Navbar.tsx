'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Home, Package, MessageSquare, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">✨ Barter Qween</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className={`flex items-center space-x-1 hover:text-purple-200 transition ${
                  isActive('/') ? 'text-yellow-300' : ''
                }`}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="/items/create"
                className={`flex items-center space-x-1 hover:text-purple-200 transition ${
                  isActive('/items/create') ? 'text-yellow-300' : ''
                }`}
              >
                <Plus size={20} />
                <span>Add Item</span>
              </Link>
              <Link
                href="/my-items"
                className={`flex items-center space-x-1 hover:text-purple-200 transition ${
                  isActive('/my-items') ? 'text-yellow-300' : ''
                }`}
              >
                <Package size={20} />
                <span>My Items</span>
              </Link>
              <Link
                href="/trades"
                className={`flex items-center space-x-1 hover:text-purple-200 transition ${
                  isActive('/trades') ? 'text-yellow-300' : ''
                }`}
              >
                <MessageSquare size={20} />
                <span>Trades</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center space-x-1 hover:text-purple-200 transition ${
                  isActive('/profile') ? 'text-yellow-300' : ''
                }`}
              >
                <User size={20} />
                <span>{userData?.displayName || 'Profile'}</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1 hover:text-purple-200 transition"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hover:text-purple-200 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-100 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
