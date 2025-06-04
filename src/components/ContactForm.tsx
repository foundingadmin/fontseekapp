import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import emailjs from '@emailjs/browser';
import brandmarkLogo from '/Founding-v1-Brandmark-white.svg';

interface ContactFormProps {
  onDownloadReport: () => void;
  onShowInfo: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onDownloadReport, onShowInfo }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const initialEmail = useQuizStore(state => state.email);
  const [email, setEmail] = useState(initialEmail || '');
  const scores = useQuizStore(state => state.scores);
  const recommendations = useQuizStore(state => state.recommendations);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLogoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (logoRef.current) {
      observer.observe(logoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (!formRef.current) return;

      const result = await emailjs.sendForm(
        'service_wxwzny7',
        'template_bpieskn',
        formRef.current,
        'EzMx5EhE7iYubMY-i'
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        formRef.current.reset();
        onDownloadReport();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-24 mb-16 glass-card rounded-xl overflow-hidden">
      <div className="px-8 py-12">
        <div 
          ref={logoRef}
          className={`transition-all duration-700 transform ${
            isLogoVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <a href="/" className="block mb-8">
            <img 
              src={brandmarkLogo}
              alt="FontSeek - Strategy-Driven Font Recommendations" 
              className="w-16 h-auto mx-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                console.error('Failed to load image:', img.src);
              }}
            />
          </a>
        </div>
        
        <div className="max-w-[515px] mx-auto">
          <h2 className="text-xl font-semibold text-white mb-2 text-center">
            Ready to bring your brand font to life?
          </h2>
          <p className="text-white/60 text-center mb-8 text-base">
            Let's explore how to bring your brand's unique personality to life through a strategic, conversion-focused website design.
          </p>

          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <input type="hidden" name="subject" value="FontSeek Consultation Request" />
            <input type="hidden" name="aesthetic" value={recommendations?.aestheticStyle || ''} />
            <input type="hidden" name="option1" value={recommendations?.primary.name || ''} />
            <input type="hidden" name="option2" value={recommendations?.secondary.name || ''} />
            <input type="hidden" name="option3" value={recommendations?.tertiary.name || ''} />

            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Tell us about your brand and what you'd like help with..."
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <ArrowRight className="w-5 h-5" />
            </button>

            {submitStatus === 'success' && (
              <p className="text-emerald-500 text-center">Message sent successfully! We'll be in touch soon.</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <h3 className="text-white text-sm font-medium mb-1">Design that works</h3>
            <p className="text-white/60 text-sm">
              Turn brand personality into high-performing experiences.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white text-sm font-medium mb-1">Built to scale</h3>
            <p className="text-white/60 text-sm">
              Responsive, user-first websites designed to grow with you.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white text-sm font-medium mb-1">Your strategic partner</h3>
            <p className="text-white/60 text-sm">
              Work with experts to create a site that reflects your brand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};