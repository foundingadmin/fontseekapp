import React from 'react';
import { Menu } from 'lucide-react';
import brandmarkLogo from '/Founding-v1-Brandmark-white.svg';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="block">
            <img 
              src={brandmarkLogo}
              alt="FontSeek - Strategy-Driven Font Recommendations" 
              className="w-[140px] h-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                console.error('Failed to load image:', img.src);
              }}
            />
          </a>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>
    </header>
  );
};