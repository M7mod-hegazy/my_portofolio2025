import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';

export const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactInfo, setContactInfo] = useState({
    email: 'medo.hagaze33@gmail.com',
    phone: '',
    location: '',
    website: '',
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
        console.error("Failed to fetch contact info", error);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get In <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Let's discuss your next project or just say hello!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.email && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.phone && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${contactInfo.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.location && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{contactInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Send Message</h3>
            <form onSubmit={handleSubmit} className="bg-secondary/30 rounded-lg p-8 shadow-xl space-y-6">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-4 rounded-lg border border-primary/20 bg-background/60 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-300"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-4 rounded-lg border border-primary/20 bg-background/60 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-300"
                required
              />
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full p-4 rounded-lg border border-primary/20 bg-background/60 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-300"
                required
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={6}
                className="w-full p-4 rounded-lg border border-primary/20 bg-background/60 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none resize-none transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};