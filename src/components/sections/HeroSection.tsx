import { Button } from "@/components/ui/button"
import { Scene3D } from "@/components/3d/Scene3D"
import { ChevronDown, Download, Mail, Github, Linkedin, Instagram, Facebook } from "lucide-react"
import { FaWhatsapp, FaFacebookMessenger, FaXTwitter } from 'react-icons/fa6'
import { useEffect, useState } from "react"

export const HeroSection = () => {
  const [cvUrl, setCvUrl] = useState('');
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
    const fetchData = async () => {
      try {
        const [cvRes, contactRes] = await Promise.all([
          fetch('/api/cv'),
          fetch('/api/contact')
        ]);

        const cvData = await cvRes.json();
        if (cvData.success && cvData.data) {
          setCvUrl(cvData.data.url);
        }

        const contactData = await contactRes.json();
        if (contactData.success && contactData.data) {
          setContactInfo(contactData.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-accent font-medium tracking-wide uppercase text-sm">
                  Portfolio
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Creative
                  <span className="text-gradient block">Developer</span>
                </h1>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Building digital experiences with modern technologies, 
                creative design, and innovative solutions. Welcome to my digital space.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {cvUrl ? (
                  <Button asChild variant="hero" size="xl" className="group">
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                      Download CV
                    </a>
                  </Button>
                ) : (
                  <Button variant="hero" size="xl" className="group" disabled>
                    <Download className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                    CV Coming Soon
                  </Button>
                )}
                <Button
                  variant="glass"
                  size="xl"
                  className="group"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Mail className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Get In Touch
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex justify-center lg:justify-start gap-4 mt-8">
                {contactInfo.linkedin && contactInfo.linkedin.trim() && (
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"
                     className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 group">
                    <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {contactInfo.github && contactInfo.github.trim() && (
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer"
                     className="p-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 hover:shadow-xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-110 group">
                    <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {contactInfo.twitter && contactInfo.twitter.trim() && (
                  <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer"
                     className="p-3 rounded-full bg-gradient-to-r from-gray-800 to-black hover:shadow-xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-110 group">
                    <FaXTwitter className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {contactInfo.instagram && contactInfo.instagram.trim() && (
                  <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer"
                     className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-110 group">
                    <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {contactInfo.facebook && contactInfo.facebook.trim() && (
                  <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer"
                     className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl hover:shadow-blue-600/25 transition-all duration-300 hover:scale-110 group">
                    <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {contactInfo.whatsapp && contactInfo.whatsapp.trim() && (
                  <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                     className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 group">
                    <FaWhatsapp className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {contactInfo.messenger && contactInfo.messenger.trim() && (
                  <a href={contactInfo.messenger} target="_blank" rel="noopener noreferrer"
                     className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 group">
                    <FaFacebookMessenger className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* 3D Scene */}
          <div className="relative">
            <Scene3D height="h-96 lg:h-[500px]" className="floating" />
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  )
}