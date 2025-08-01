import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Lightbulb, Rocket, MapPin, Calendar, Star, Trophy, Code, Users } from 'lucide-react';

export const RoadmapSection = () => {
  const [roadmapData, setRoadmapData] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        const res = await fetch('/api/journey');
        const data = await res.json();
        if (data.success) {
          // Transform journey data to roadmap format
          const transformedData = data.data.map((item) => ({
            ...item,
            icon: getIconForType(item.type),
            color: getColorForType(item.type)
          }));
          setRoadmapData(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch journey data", error);
        // Fallback to default data if API fails
        setRoadmapData(getDefaultRoadmapData());
      }
    };
    fetchJourneyData();
  }, []);

  const getIconForType = (type) => {
    switch (type) {
      case 'work':
        return <Briefcase className="w-6 h-6" />;
      case 'education':
        return <GraduationCap className="w-6 h-6" />;
      case 'project':
        return <Code className="w-6 h-6" />;
      default:
        return <Rocket className="w-6 h-6" />;
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'work':
        return 'from-blue-500 to-purple-600';
      case 'education':
        return 'from-green-500 to-teal-600';
      case 'project':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const getDefaultRoadmapData = () => [
  {
    year: '2024',
    period: 'Present',
    title: 'Senior Full-Stack Developer',
    company: 'Tech Innovation Hub',
    location: 'Cairo, Egypt',
    description: 'Leading development of cutting-edge web applications using modern technologies. Architecting scalable solutions and mentoring junior developers.',
    icon: <Rocket className="w-6 h-6" />,
    color: 'from-blue-500 to-purple-600',
    achievements: [
      'Led team of 5 developers',
      'Increased app performance by 40%',
      'Implemented CI/CD pipelines'
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    type: 'work'
  },
  {
    year: '2022',
    period: '2023',
    title: 'Full-Stack Developer',
    company: 'Digital Solutions Co.',
    location: 'Remote',
    description: 'Developed and maintained multiple client projects, focusing on responsive design and optimal user experience.',
    icon: <Code className="w-6 h-6" />,
    color: 'from-green-500 to-teal-600',
    achievements: [
      'Delivered 15+ projects',
      'Client satisfaction: 98%',
      'Reduced load times by 60%'
    ],
    technologies: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Redis'],
    type: 'work'
  },
  {
    year: '2020',
    period: '2022',
    title: 'Frontend Developer',
    company: 'StartupTech',
    location: 'Alexandria, Egypt',
    description: 'Specialized in creating beautiful, interactive user interfaces and improving user experience across web platforms.',
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600',
    achievements: [
      'Redesigned main platform UI',
      'Improved user engagement by 35%',
      'Built component library'
    ],
    technologies: ['JavaScript', 'React', 'SASS', 'Figma', 'Git'],
    type: 'work'
  },
  {
    year: '2018',
    period: '2022',
    title: 'Computer Science Degree',
    company: 'Cairo University',
    location: 'Cairo, Egypt',
    description: 'Bachelor of Science in Computer Science with focus on software engineering, algorithms, and artificial intelligence.',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-600',
    achievements: [
      'Graduated with Honors',
      'GPA: 3.8/4.0',
      'Published research paper'
    ],
    technologies: ['Java', 'C++', 'Python', 'Machine Learning', 'Data Structures'],
    type: 'education'
  }
];

const TimelineItem = ({ item, index, isInView }) => {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex items-center gap-8 mb-16 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content Card */}
      <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="glass-card p-6 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg"
        >
          {/* Header */}
          <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            <div className={`${isLeft ? 'order-2' : 'order-1'}`}>
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              <p className="text-sm font-medium text-primary">{item.company}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                <span>{item.location}</span>
                <Calendar className="w-3 h-3 ml-2" />
                <span>{item.year} - {item.period}</span>
              </div>
            </div>
            <div className={`${isLeft ? 'order-1' : 'order-2'} p-3 rounded-full bg-gradient-to-r ${item.color} shadow-lg`}>
              <div className="text-white">
                {item.icon}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Achievements */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Key Achievements
            </h4>
            <ul className="space-y-1">
              {item.achievements.map((achievement, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-500" />
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Node */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
          className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} shadow-lg z-10 border-4 border-background`}
        />
        <div className="absolute top-4 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>

      {/* Year Badge */}
      <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, delay: index * 0.2 + 0.1 }}
          className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white font-bold text-lg shadow-lg`}
        >
          {item.year}
        </motion.div>
        <div className={`mt-2 px-3 py-1 rounded-full ${item.type === 'work' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs font-medium inline-block`}>
          {item.type === 'work' ? '💼 Work' : '🎓 Education'}
        </div>
      </div>
    </motion.div>
  );
};

  return (
    <section id="roadmap" className="py-20 bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From student to professional developer - here's my career roadmap with key milestones,
            achievements, and the technologies that shaped my journey.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-green-500" />
              <span>4+ Years Experience</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>20+ Projects Delivered</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative max-w-6xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-accent to-primary/20" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {roadmapData.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Ready for the next challenge
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
