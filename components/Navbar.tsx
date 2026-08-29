'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, PlusCircle, LayoutDashboard, ExternalLink } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Aivora Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                  Aivora <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">DocFlow</span>
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link 
                href="/" 
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-1.5 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Pipeline Dashboard
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <a 
              href="https://aivoraai.online/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition px-2.5 py-1 rounded border border-slate-800"
            >
              aivoraai.online
              <ExternalLink className="w-3 h-3" />
            </a>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              New Client Document
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
