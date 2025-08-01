import { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, Facebook, Heart } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaXTwitter } from 'react-icons/fa6';

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

  return (
    <footer className="bg-gradient-to-br from-background via-secondary/5 to-background border-t border-primary/10">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg"></div>
                <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-2 rounded-full border border-primary/40 shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Mohamed Hegazy Logo"
                    className="w-8 h-8 object-contain filter brightness-0 invert"
                    onError={(e) => {
                      // Fallback if logo doesn't exist
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg">Mahmoud Hegazi</h3>
              <p className="text-muted-foreground text-sm">Electronics & Telecommunications Engineer</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-3">
              {contactInfo.linkedin && contactInfo.linkedin.trim() && (
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"
                   className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 group">
                  <Linkedin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contactInfo.github && contactInfo.github.trim() && (
                <a href={contactInfo.github} target="_blank" rel="noopener noreferrer"
                   className="p-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 hover:shadow-xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-110 group">
                  <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contactInfo.twitter && contactInfo.twitter.trim() && (
                <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer"
                   className="p-3 rounded-full bg-gradient-to-r from-gray-800 to-black hover:shadow-xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-110 group">
                  <FaXTwitter className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contactInfo.instagram && contactInfo.instagram.trim() && (
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer"
                   className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-110 group">
                  <Instagram className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contactInfo.facebook && contactInfo.facebook.trim() && (
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer"
                   className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl hover:shadow-blue-600/25 transition-all duration-300 hover:scale-110 group">
                  <Facebook className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contactInfo.whatsapp && contactInfo.whatsapp.trim() && (
                <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                   className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 group">
                  <FaWhatsapp className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contactInfo.messenger && contactInfo.messenger.trim() && (
                <a href={contactInfo.messenger} target="_blank" rel="noopener noreferrer"
                   className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 group">
                  <FaFacebookMessenger className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-end gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Mahmoud Hegazi
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              © {currentYear} All rights reserved.
            </p>
          </div>
        </div>

       
      </div>
    </footer>
  );
};
