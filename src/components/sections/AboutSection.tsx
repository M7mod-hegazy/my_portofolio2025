import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Briefcase, Phone, Paintbrush, Download } from "lucide-react"; // Example icons
import { Tooltip } from '@/components/ui/tooltip';
import * as SimpleIcons from "react-icons/si";

export const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [currentCV, setCurrentCV] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, skillsRes, servicesRes, cvRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/skills'),
          fetch('/api/services'),
          fetch('/api/cv')
        ]);
        const aboutData = await aboutRes.json();
        const skillsData = await skillsRes.json();
        const servicesData = await servicesRes.json();
        const cvData = await cvRes.json();

        if (aboutData.success && aboutData.data) setAboutContent(aboutData.data.content);
        if (skillsData.success) setSkills(skillsData.data);
        if (servicesData.success) setServices(servicesData.data);
        if (cvData.success && cvData.data) setCurrentCV(cvData.data);
      } catch (error) {
        console.error("Failed to fetch about section data", error);
      }
    };
    fetchData();
  }, []);
  
  // A simple map for placeholder icons
  const iconMap: { [key: string]: React.ElementType } = {
    code: Code,
    paintbrush: Paintbrush,
    default: Code,
  };
  
  // Group skills by category, only show 'Other' if needed
  const skillsByCategory: { [category: string]: typeof skills } = {};
  skills.forEach((skill: any) => {
    const cat = skill.category && skill.category !== 'Select Category' ? skill.category : 'Other';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(skill);
  });
  
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="glass-card p-8 mb-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold">
              My <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              {aboutContent || 'Loading...'}
            </p>
            {currentCV && (
              <div className="mt-8">
                <Button
                  onClick={() => window.open(currentCV.url, '_blank')}
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download CV
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* What I Do - Full Width */}
        <div className="glass-card p-8 mb-12">
          <h3 className="text-3xl font-bold mb-8 text-center">What I Do</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-secondary/60 to-secondary/40 rounded-xl p-6 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary/10 hover:border-primary/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="font-bold text-xl mb-2">Fullstack</div>
                <div className="text-muted-foreground text-sm">Building robust web applications from backend to frontend.</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary/60 to-secondary/40 rounded-xl p-6 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary/10 hover:border-primary/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="font-bold text-xl mb-2">Marketing</div>
                <div className="text-muted-foreground text-sm">Digital marketing, SEO, and growth strategies for your business.</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary/60 to-secondary/40 rounded-xl p-6 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary/10 hover:border-primary/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="font-bold text-xl mb-2">Telecommunication</div>
                <div className="text-muted-foreground text-sm">Expertise in telecom networks, protocols, and solutions.</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary/60 to-secondary/40 rounded-xl p-6 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary/10 hover:border-primary/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                <Paintbrush className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="font-bold text-xl mb-2">Design</div>
                <div className="text-muted-foreground text-sm">UI/UX design for modern, user-friendly digital products.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Technologies - Full Width */}
        <div className="glass-card p-8">
          <h3 className="text-3xl font-bold mb-8 text-center">Skills & Technologies</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              (category !== 'Other' || skills.length > 0) && (
                <div key={category} className="space-y-4">
                  <div className="text-center">
                    <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary font-bold text-xl shadow-lg border border-primary/20">
                      {category}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-3 justify-items-center">
                    {skills.map((skill: any) => {
                      const IconComponent = SimpleIcons[skill.icon] || Code;
                      return (
                        <Tooltip key={skill._id} content={skill.name}>
                          <div className="group relative">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/60 to-secondary/40 hover:from-primary/20 hover:to-accent/20 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 border border-primary/10 hover:border-primary/30">
                              <IconComponent className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                              {skill.name}
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}