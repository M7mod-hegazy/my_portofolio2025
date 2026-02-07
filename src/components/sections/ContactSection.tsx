import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, Loader2, Mail, MapPin, Phone, Github, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";

interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        toast.success("Message sent successfully! I'll get back to you soon.");
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ name: "", email: "", message: "" });
        }, 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: contactInfo.email, href: contactInfo.email ? `mailto:${contactInfo.email}` : null },
    { icon: Phone, label: "Phone", value: contactInfo.phone, href: contactInfo.phone ? `tel:${contactInfo.phone}` : null },
    { icon: MapPin, label: "Location", value: contactInfo.location, href: null },
  ].filter(item => item.value);

  const socialLinks = [
    { icon: Github, url: contactInfo.github, label: "GitHub" },
    { icon: Linkedin, url: contactInfo.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: contactInfo.twitter, label: "Twitter" },
    { icon: Instagram, url: contactInfo.instagram, label: "Instagram" },
    { icon: Facebook, url: contactInfo.facebook, label: "Facebook" },
  ].filter(item => item.url);

  // Wizard State
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep === 0 && !formData.name) return toast.error("Name is required");
    if (currentStep === 1 && !formData.email) return toast.error("Email is required");
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <section id="contact" ref={containerRef} className="py-16 md:py-32 relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px]" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* MOBILE WIZARD (Visible on < lg) */}
        <div className="lg:hidden max-w-lg mx-auto min-h-[60vh] flex flex-col justify-center">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentStep === 0 && "What's your name?"}
              {currentStep === 1 && "How can I reach you?"}
              {currentStep === 2 && "What's on your mind?"}
            </h2>
            <p className="text-gray-400 text-sm">
              Step {currentStep + 1} of {totalSteps}
            </p>
            <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Input
                    autoFocus
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 text-2xl h-16 focus:ring-0 focus:border-primary placeholder:text-white/20"
                  />
                </motion.div>
              )}
              {currentStep === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Input
                    autoFocus
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 text-2xl h-16 focus:ring-0 focus:border-primary placeholder:text-white/20"
                  />
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Textarea
                    autoFocus
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 text-xl min-h-[200px] focus:ring-0 focus:border-primary placeholder:text-white/20 resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-8">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-14 border-white/10 hover:bg-white/10">
                  Back
                </Button>
              )}
              {currentStep < 2 ? (
                <Button type="button" onClick={nextStep} className="flex-1 h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg">
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Send Message"}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-12 flex justify-center gap-6">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.url} target="_blank" className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white">
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>


        {/* DESKTOP GRID (Visible on >= lg) */}
        <div className="hidden lg:block max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-primary" />
              <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.15em] md:tracking-[0.2em]">Contact</span>
              <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
              Let's <span className="text-primary">Connect</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto px-4">
              Have a project in mind? Send me a message and I'll get back to you soon.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Contact Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Contact Details */}
              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="group"
                  >
                    {item.href ? (
                      <a href={item.href} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10">
                        <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <item.icon size={16} className="text-primary md:w-5 md:h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                          <p className="text-white text-sm md:text-base font-medium truncate">{item.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                        <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-primary/10">
                          <item.icon size={16} className="text-primary md:w-5 md:h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                          <p className="text-white text-sm md:text-base font-medium truncate">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Follow Me</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/10 transition-all"
                      >
                        <social.icon size={20} className="text-gray-400 hover:text-white transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs md:text-base font-medium">Available for new opportunities</span>
                </div>
              </div>
            </motion.div>

            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Name</label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-black/30 border-white/10 focus:border-primary/50 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-black/30 border-white/10 focus:border-primary/50 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Message</label>
                    <Textarea
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[150px] bg-black/30 border-white/10 focus:border-primary/50 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="w-full h-12 md:h-14 text-sm md:text-lg font-semibold bg-gradient-to-r bg-primary hover:bg-primary/90 text-primary-foreground hover:from-purple-600 hover:to-cyan-600 transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isSuccess ? (
                      <><CheckCircle2 className="w-5 h-5 mr-2" /> Message Sent!</>
                    ) : (
                      <><Send className="w-5 h-5 mr-2" /> Send Message</>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};