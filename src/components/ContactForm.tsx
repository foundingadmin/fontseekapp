import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

interface ContactFormProps {
  onDownloadReport: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onDownloadReport }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const email = useQuizStore(state => state.email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const form = e.target as HTMLFormElement;
      const data = new FormData(form);
      
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as any).toString()
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitStatus('success');
      form.reset();
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
        <img 
          src="/src/assets/Founding-v1-Wordmark-white.svg" 
          alt="Founding" 
          className="w-[140px] mx-auto mb-8"
        />
        
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Ready to bring your brand voice to life?
        </h2>
        <p className="text-white/60 text-center mb-12 text-lg">
          Let's discuss how we can help you implement your font recommendations across your brand, marketing, and web presence.
        </p>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </p>

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
              value={email || ''}
              readOnly
              className="w-full px-4 py-3 bg-[#2A2D36] border border-white/10 rounded-lg text-white/60 focus:outline-none cursor-not-allowed"
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
            Send Message
            <ArrowRight className="w-5 h-5" />
          </button>

          {submitStatus === 'success' && (
            <p className="text-emerald-500 text-center">Message sent successfully!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
          )}
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Brand Strategy</h3>
            <p className="text-white/60 text-sm">
              Develop a comprehensive brand strategy aligned with your font personality
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Marketing Implementation</h3>
            <p className="text-white/60 text-sm">
              Create marketing materials that consistently reflect your brand voice
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">Web Presence</h3>
            <p className="text-white/60 text-sm">
              Design a website that embodies your brand voice and engages your audience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};