import React, { useState } from 'react';
import { Info, X, ArrowUpRight } from 'lucide-react';

export const InfoPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
        aria-label="About FontSeek"
      >
        <Info className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
            isClosing 
              ? 'bg-black/0 backdrop-blur-none' 
              : 'bg-black/80 backdrop-blur-sm'
          }`}
        >
          <div 
            className={`relative w-full max-w-2xl max-h-[90vh] bg-[#1C1F26] rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
              isClosing
                ? 'opacity-0 scale-95 translate-y-4'
                : 'opacity-100 scale-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                aria-label="Close popup"
              >
                <X className="w-5 h-5 text-white transition-transform duration-200 group-hover:rotate-90" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <h2 className="text-3xl font-bold text-white mb-8">
                Why we built FontSeek
              </h2>

              <div className="space-y-6 text-lg text-white/80">
                <p className="font-medium text-emerald-400">
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

                <p className="font-medium text-emerald-400">
                  FontSeek doesn't just suggest fonts. It helps bring your website and your brand to life with purpose.
                </p>

                <div className="pt-8 border-t border-white/10">
                  <p className="text-white/60 mb-4">
                    Need help bringing your website and brand to life with purpose.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://foundingcreative.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-all duration-200 hover:scale-105 font-medium group"
                    >
                      Visit foundingcreative.com
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a
                      href="mailto:admin@foundingcreative.com"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-105 group"
                    >
                      Email us directly
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-200 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleClose}
        />
      )}
    </>
  );
};