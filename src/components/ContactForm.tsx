import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import emailjs from '@emailjs/browser';
import brandmarkLogo from '/Founding-v1-Brandmark-white.svg';

interface ContactFormProps {
  onDownloadReport: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onDownloadReport }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const initialEmail = useQuizStore(state => state.email);
  const [email, setEmail] = useState(initialEmail || '');
  const scores = useQuizStore(state => state.scores);
  const recommendations = useQuizStore(state => state.recommendations);

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
    <div className="mt-24 mb-16 bg-[#1C1F26] rounded-xl overflow-hidden">
      <div className="px-8 py-12 max-w-3xl mx-auto">
        <a href="/" className="block mb-8">
          <img 
            src={brandmarkLogo}
            alt="FontSeek - Strategy-Driven Font Recommendations" 
            className="w-[140px] h-auto mx-auto"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              console.error('Failed to load image:', img.src);
            }}
          />
        </a>
        
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Love your font match? Let's bring your brand to life online.
        </h2>
        <p className="text-white/60 text-center mb-12 text-lg">
          Let's explore how to bring your brand's unique personality to life through a strategic, conversion-focused website design. Our team specializes in crafting digital experiences that turn visitors into loyal customers.
        </p>

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="space-y-6"
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
              className="w-full px-4 py-3 bg-[#2A2D36] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
              className="w-full px-4 py-3 bg-[#2A2D36] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Tell us about your brand and what you'd like help with..."
              required
              rows={4}
              className="w-full px-4 py-3 bg-[#2A2D36] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Strategic Web Design That Converts</h3>
            <p className="text-white/60 text-sm">
              Transform your brand's personality into an engaging online presence. Our data-driven approach ensures your website not only looks stunning but drives real business results.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Built for Growth & Impact</h3>
            <p className="text-white/60 text-sm">
              We craft responsive, user-focused websites that scale with your business. Every design choice, from typography to interaction, is purposefully selected to enhance your digital performance.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Expert Guidance, Proven Process</h3>
            <p className="text-white/60 text-sm">
              Partner with our experienced team to develop a website that authentically represents your brand while delivering measurable ROI through strategic design and development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};