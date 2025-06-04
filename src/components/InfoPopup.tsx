import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

interface InfoPopupProps {
  onClose?: () => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300 ${
          isClosing ? 'opacity-0 backdrop-blur-none' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-3xl glass-card rounded-[32px] shadow-2xl transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-6 right-6">
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors group"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-white/60 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-[-0.02em] leading-[1.1]">
              Why we built FontSeek
            </h2>

            <div className="space-y-4 text-base text-white/80 tracking-[-0.01em] leading-relaxed">
              <p className="text-lg md:text-xl text-white font-medium tracking-[-0.02em]">
                Most font tools start with how a font looks. We start instead with what your brand feels like.
              </p>

              <p>
                FontSeek was built for founders, marketers, and non-designers who want to choose a font with confidence without needing a design degree. Traditional font filters like "serif" or "sans-serif" don't help you understand why a font works for your brand.
              </p>

              <p>
                That's where FontSeek is different.
              </p>

              <p>
                We designed this quick, strategy-led tool that maps your brand's personality traits to fonts that align with your tone, energy, and structure. The result is ready-to-use-immediately free fonts that look right because they feel right.
              </p>

              <p className="text-lg md:text-xl text-white font-medium tracking-[-0.02em]">
                FontSeek doesn't just suggest fonts. It helps bring your website and your brand to life with purpose.
              </p>

              <div className="pt-6 mt-6 border-t border-white/10">
                <p className="text-white/60 mb-4 text-sm">
                  Need help bringing your website and brand to life with purpose?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://foundingcreative.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.02] font-medium group text-sm"
                  >
                    Visit Website
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="mailto:admin@foundingcreative.com"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass-card text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/10 transition-all duration-300 hover:scale-[1.02] group text-sm"
                  >
                    Send Email
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};