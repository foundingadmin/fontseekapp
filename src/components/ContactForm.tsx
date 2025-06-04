import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
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
    <div className="mt-24 mb-16 glass-card rounded-[32px] overflow-hidden">
      <div className="px-8 py-12 max-w-3xl mx-auto">
        <div 
          ref={logoRef}
          className={`transition-all duration-1000 transform ${
            isLogoVisible 
              ? 'opacity-100 translate-y-0 rotate-0' 
              : 'opacity-0 translate-y-8 rotate-12'
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
        
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Ready to bring your brand font to life?
        </h2>
        <p className="text-white/60 text-center mb-12 text-lg">
          Let's explore how to bring your brand's unique personality to life through a strategic, conversion-focused website design. Our team specializes in crafting digital experiences that turn visitors into loyal customers.
        </p>

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="space-y-6 max-w-[600px] mx-auto"
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
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Tell us about your brand and what you'd like help with..."
              required
              rows={4}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[24px] text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-black font-semibold rounded-full hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Design that works</h3>
            <p className="text-white/60 text-sm">
              Turn brand personality into high-performing experiences. Our sites look great and convert.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Built to scale</h3>
            <p className="text-white/60 text-sm">
              Responsive, user-first websites designed to grow with you for long-term impact.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Your strategic partner</h3>
            <p className="text-white/60 text-sm">
              Work with our experts to create a site that reflects the real meaning behind your brand.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onShowInfo}
            className="flex items-center justify-center gap-2 mx-auto text-emerald-400 hover:text-emerald-300 transition-colors text-sm group"
          >
            About FontSeek
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};