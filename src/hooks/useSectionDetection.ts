import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useSectionDetection = () => {
  const { setCurrentSection } = useTheme();

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'journey', 'skills', 'projects', 'certifications', 'contact'];

    const observerOptions = {
      root: null,
      // Create a "detection zone" near the top of the viewport
      // -20% from top (ignores header area)
      // -60% from bottom (ignores bottom half of screen)
      // This means a section becomes active when it enters the upper 40% of the screen
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sections.includes(sectionId)) {
            setCurrentSection(sectionId);
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [setCurrentSection]);
};
