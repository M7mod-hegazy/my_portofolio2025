import { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, Facebook, Heart, ArrowUp, Mail, Code } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';

export const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    linkedin: '',
    github: '',
    twitter: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    messenger: ''
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();
        if (data.success && data.data) {
          setContactInfo(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Linkedin, url: contactInfo.linkedin, color: 'from-blue-600 to-blue-800', label: 'LinkedIn' },
    { icon: Github, url: contactInfo.github, color: 'from-gray-700 to-gray-900', label: 'GitHub' },
    { icon: FaXTwitter, url: contactInfo.twitter, color: 'from-gray-800 to-black', label: 'Twitter' },
    { icon: Instagram, url: contactInfo.instagram, color: 'from-pink-500 to-purple-600', label: 'Instagram' },
    { icon: Facebook, url: contactInfo.facebook, color: 'from-blue-600 to-blue-700', label: 'Facebook' },
    { icon: FaWhatsapp, url: contactInfo.whatsapp ? `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}` : '', color: 'from-green-500 to-green-600', label: 'WhatsApp' },
    { icon: FaFacebookMessenger, url: contactInfo.messenger, color: 'from-blue-500 to-indigo-600', label: 'Messenger' },
  ];

  return (
    <footer className="relative border-t border-primary/10 bg-gradient-to-b from-background to-secondary/10">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 dark:opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 dark:opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg"></div>
                <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-2 rounded-full border border-primary/40 shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-8 h-8 object-contain filter brightness-0 invert"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Mahmoud Hegazi</h3>
                <p className="text-xs text-muted-foreground">Electronics & Telecom Engineer</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building innovative digital solutions with modern technologies and creative design.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'About', 'Projects', 'Certifications', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const id = item.toLowerCase();
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Get notified about new projects and updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-secondary/40 border border-primary/20 focus:border-primary/50 outline-none transition-colors text-sm"
              />
              <motion.button
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-3 mb-12 pb-12 border-b border-primary/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {socialLinks.map((link, idx) => {
            if (!link.url || !link.url.trim()) return null;
            const Icon = link.icon;
            return (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full bg-gradient-to-r ${link.color} hover:shadow-lg transition-all duration-300`}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Icon className="w-4 h-4 text-white" />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Copyright */}
          <div className="text-center md:text-left text-sm text-muted-foreground">
            <p className="flex items-center justify-center md:justify-start gap-1 mb-1">
              Made with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="inline-flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.span> by Mahmoud Hegazi
            </p>
            <p>© {currentYear} All rights reserved.</p>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code className="w-4 h-4" />
            <span>Built with React • Vite • Tailwind • Framer Motion</span>
          </div>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40 hover:border-primary/60 transition-all duration-300"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <ArrowUp className="w-4 h-4 text-primary" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};
