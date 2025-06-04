import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';

interface InfoPopupProps {
  onClose?: () => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[65] bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-4xl glass-card rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-6 right-6">
            <button
              onClick={onClose}
              className="p-2.5 rounded-full glass-card text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all duration-300 group"
              aria-label="Close popup"
            >
              <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          <div className="p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-[-0.02em]">
              Why we built FontSeek
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 tracking-[-0.01em]">
              <p className="text-2xl text-emerald-400 font-medium tracking-[-0.02em]">
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

              <p className="text-2xl text-emerald-400 font-medium tracking-[-0.02em]">
                FontSeek doesn't just suggest fonts. It helps bring your website and your brand to life with purpose.
              </p>

              <div className="pt-8 mt-8 border-t border-white/10">
                <p className="text-white/60 mb-6 text-lg">
                  Need help bringing your website and brand to life with purpose?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://foundingcreative.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-full hover:bg-emerald-400 transition-all duration-300 hover:scale-105 font-medium group text-base"
                  >
                    Visit foundingcreative.com
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="mailto:admin@foundingcreative.com"
                    className="flex items-center justify-center gap-2 px-6 py-3 glass-card text-emerald-400 border border-emerald-500/20 rounded-full hover:bg-emerald-500/10 transition-all duration-300 hover:scale-105 group text-base"
                  >
                    Email us directly
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};