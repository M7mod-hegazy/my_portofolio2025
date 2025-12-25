import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Download, Github, Linkedin, Twitter, Mail,
  MapPin, ArrowRight, Award, Target, Heart, Sparkles
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface Stat {
  label: string;
  value: string;
}

interface Passion {
  icon: string;
  label: string;
}

interface AboutData {
  name: string;
  title: string;
  location: string;
  content: string;
  avatar: string;
  mission: string;
  stats: Stat[];
  passions: Passion[];
  tags: string[];
  ctaTitle: string;
  ctaSubtitle: string;
}

const defaultData: AboutData = {
  name: "Your Name",
  title: "Creative Developer",
  location: "Your Location",
  content: "I am an Electronics & Telecommunications Engineer passionate about creating innovative digital solutions.",
  avatar: "",
  mission: "Building scalable products that blend technical excellence with intuitive design.",
  stats: [
    { value: "5+", label: "Years Experience" },
    { value: "50+", label: "Projects" },
    { value: "30+", label: "Clients" },
    { value: "100%", label: "Dedication" },
  ],
  passions: [
    { icon: "Code", label: "Clean Code" },
    { icon: "Palette", label: "UI/UX Design" },
    { icon: "Cpu", label: "Innovation" },
    { icon: "Heart", label: "Open Source" },
  ],
  tags: ["Full-Stack", "React", "Node.js", "TypeScript"],
  ctaTitle: "Let's Build Something Amazing",
  ctaSubtitle: "Open to collaborations and new opportunities."
};

// Helper to get icon component from string name
const getIcon = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || Heart;
};

export const AboutSection = () => {
  const [data, setData] = useState<AboutData>(defaultData);
  const [currentCV, setCurrentCV] = useState<{ url: string } | null>(null);
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, cvRes, contactRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/cv'),
          fetch('/api/contact'),
        ]);
        const aboutData = await aboutRes.json();
        const cvData = await cvRes.json();
        const contactData = await contactRes.json();

        if (aboutData.success && aboutData.data) {
          const d = aboutData.data;
          setData({
            name: d.name || defaultData.name,
            title: d.title || defaultData.title,
            location: d.location || defaultData.location,
            content: d.content || defaultData.content,
            avatar: d.avatar || "",
            mission: d.mission || defaultData.mission,
            stats: d.stats?.length > 0 ? d.stats : defaultData.stats,
            passions: d.passions?.length > 0 ? d.passions : defaultData.passions,
            tags: d.tags?.length > 0 ? d.tags : defaultData.tags,
            ctaTitle: d.ctaTitle || defaultData.ctaTitle,
            ctaSubtitle: d.ctaSubtitle || defaultData.ctaSubtitle,
          });
        }
        if (cvData.success && cvData.data) setCurrentCV(cvData.data);
        if (contactData.success && contactData.data) setSocialLinks(contactData.data);
      } catch (error) {
        console.error("Failed to fetch about section data", error);
      }
    };
    fetchData();
  }, []);

  const socialIcons = [
    { icon: Github, label: 'GitHub', url: socialLinks?.github, hoverBg: 'hover:bg-[#333]' },
    { icon: Linkedin, label: 'LinkedIn', url: socialLinks?.linkedin, hoverBg: 'hover:bg-[#0077B5]' },
    { icon: Twitter, label: 'Twitter', url: socialLinks?.twitter, hoverBg: 'hover:bg-[#1DA1F2]' },
    { icon: Mail, label: 'Email', url: socialLinks?.email ? `mailto:${socialLinks.email}` : null, hoverBg: 'hover:bg-red-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section ref={containerRef} id="about" className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
          <span className="text-primary text-sm font-medium uppercase tracking-[0.2em]">About Me</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-16"
        >
          Crafting Digital
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
            Experiences
          </span>
        </motion.h2>

        {/* BENTO GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {/* Card 1: Profile Image */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1 lg:row-span-2 group">
            <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 hover:border-white/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {data.avatar ? (
                <img src={data.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Name Badge */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-1">{data.name}</h3>
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <MapPin size={14} />
                  {data.location}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bio */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-2">
            <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-500/20">
                  <Sparkles size={20} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">The Story</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">{data.content}</p>
              {data.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-gray-400">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 3: Mission */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/20">
                  <Target size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Mission</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">{data.mission}</p>
            </div>
          </motion.div>

          {/* Card 4: Stats */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
            <div className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Award size={20} className="text-yellow-400" />
                By The Numbers
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.stats.map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 5: Passions */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-4">Passionate About</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.passions.map((item, i) => {
                  const IconComp = getIcon(item.icon);
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                      <IconComp size={16} className="text-purple-400" />
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Card 6: Social Links */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <div className="flex flex-wrap gap-3">
                {socialIcons.map(({ icon: Icon, label, url, hoverBg }) => (
                  url && (
                    <motion.a key={label} href={url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:text-white ${hoverBg}`} title={label}>
                      <Icon size={20} />
                    </motion.a>
                  )
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 7: CTA */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="h-full p-8 rounded-3xl bg-gradient-to-r from-purple-500/20 via-cyan-500/10 to-emerald-500/20 border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{data.ctaTitle}</h3>
                <p className="text-gray-400">{data.ctaSubtitle}</p>
              </div>
              <div className="flex gap-4 flex-shrink-0">
                {currentCV && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => window.open(currentCV.url, '_blank')} className="bg-white text-black hover:bg-gray-100 px-6 py-5 rounded-xl font-semibold flex items-center gap-2">
                      <Download size={18} />
                      Resume
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="border-white/20 hover:bg-white/10 px-6 py-5 rounded-xl font-semibold flex items-center gap-2">
                    Contact Me
                    <ArrowRight size={18} />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};